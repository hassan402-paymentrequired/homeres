<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ProductTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    /** @var array<string, string> */
    private array $templateIds = [];

    /** @var array<string, array{label: string, product_count: int}> */
    private array $indexLabels = [];

    /** @var array<string, true> */
    private array $seededHandles = [];

    public function run(): void
    {
        $this->loadIndexLabels();
        $this->loadTemplateIds();
        $this->bootSeededHandles();

        $sort = 0;
        foreach ($this->navigationTree() as $node) {
            $this->seedNode($node, null, $sort++);
        }

        $this->seedRemainingFromIndex();
    }

    private function bootSeededHandles(): void
    {
        $this->seededHandles = Category::query()
            ->pluck('handle')
            ->mapWithKeys(fn (string $handle): array => [$handle => true])
            ->all();
    }

    private function loadIndexLabels(): void
    {
        $path = public_path('output/index.json');

        if (! File::exists($path)) {
            return;
        }

        /** @var array{collections?: array<int, array{handle: string, label: string, product_count?: int}>} $index */
        $index = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

        foreach ($index['collections'] ?? [] as $collection) {
            $this->indexLabels[$collection['handle']] = [
                'label' => $collection['label'],
                'product_count' => $collection['product_count'] ?? 0,
            ];
        }
    }

    private function loadTemplateIds(): void
    {
        $this->templateIds = ProductTemplate::query()
            ->pluck('id', 'slug')
            ->all();
    }

    /**
     * @param  array<string, mixed>  $node
     */
    private function seedNode(array $node, ?string $parentId, int $sortOrder, ?string $navGroupLabel = null): void
    {
        if (isset($node['handle']) && ! isset($node['children']) && ! isset($node['links'])) {
            $this->upsertCategory(
                handle: $node['handle'],
                parentId: $parentId,
                sortOrder: $sortOrder,
                isAggregate: $node['aggregate'] ?? false,
                templateSlug: $node['template'] ?? $this->guessTemplate($node['handle']),
                navGroupLabel: $navGroupLabel ?? ($node['nav_group'] ?? null),
                showInNav: $node['show_in_nav'] ?? true,
            );

            return;
        }

        $handle = $node['handle'];
        $categoryId = $this->upsertCategory(
            handle: $handle,
            parentId: $parentId,
            sortOrder: $sortOrder,
            isAggregate: $node['aggregate'] ?? false,
            templateSlug: $node['template'] ?? $this->guessTemplate($handle),
            navGroupLabel: $navGroupLabel,
            showInNav: $node['show_in_nav'] ?? true,
        );

        $childSort = 0;
        foreach ($node['children'] ?? [] as $child) {
            if (isset($child['links'])) {
                foreach ($child['links'] as $leaf) {
                    $this->seedNode(
                        $leaf,
                        $categoryId,
                        $childSort++,
                        is_string($leaf['nav_group'] ?? null) ? $leaf['nav_group'] : $navGroupLabel,
                    );
                }

                continue;
            }

            $groupLabel = $child['nav_group'] ?? null;

            if (isset($child['handle']) && isset($child['children'])) {
                $groupId = $this->upsertCategory(
                    handle: $child['handle'],
                    parentId: $categoryId,
                    sortOrder: $childSort++,
                    isAggregate: $child['aggregate'] ?? true,
                    templateSlug: $child['template'] ?? $this->guessTemplate($child['handle']),
                    navGroupLabel: is_string($groupLabel) ? $groupLabel : null,
                    showInNav: $child['show_in_nav'] ?? true,
                );

                $leafSort = 0;
                foreach ($child['children'] as $leaf) {
                    $this->seedNode($leaf, $groupId, $leafSort++, is_string($groupLabel) ? $groupLabel : null);
                }

                continue;
            }

            if (isset($child['handle'])) {
                $this->seedNode($child, $categoryId, $childSort++, $groupLabel);
            }
        }
    }

    private function upsertCategory(
        string $handle,
        ?string $parentId,
        int $sortOrder,
        bool $isAggregate,
        string $templateSlug,
        ?string $navGroupLabel = null,
        bool $showInNav = true,
    ): string {
        if (isset($this->seededHandles[$handle])) {
            return Category::query()->where('handle', $handle)->value('id');
        }

        $label = $this->indexLabels[$handle]['label'] ?? str($handle)->replace('-', ' ')->title()->toString();
        $templateId = $this->templateIds[$templateSlug] ?? $this->templateIds['simple'];

        $category = Category::query()->firstOrCreate(
            ['handle' => $handle],
            [
                'parent_id' => $parentId,
                'product_template_id' => $templateId,
                'name' => $label,
                'sort_order' => $sortOrder,
                'is_active' => true,
                'show_in_nav' => $showInNav,
                'is_aggregate' => $isAggregate,
                'nav_group_label' => $navGroupLabel,
            ],
        );

        $this->seededHandles[$handle] = true;

        return $category->id;
    }

    private function seedRemainingFromIndex(): void
    {
        $sort = Category::query()->max('sort_order') + 1;

        foreach ($this->indexLabels as $handle => $meta) {
            if (isset($this->seededHandles[$handle])) {
                continue;
            }

            Category::query()->firstOrCreate(
                ['handle' => $handle],
                [
                    'parent_id' => null,
                    'product_template_id' => $this->templateIds[$this->guessTemplate($handle)] ?? $this->templateIds['simple'],
                    'name' => $meta['label'],
                    'sort_order' => $sort++,
                    'is_active' => true,
                    'show_in_nav' => false,
                    'is_aggregate' => false,
                ],
            );

            $this->seededHandles[$handle] = true;
        }
    }

    private function guessTemplate(string $handle): string
    {
        if (str_starts_with($handle, 'outdoor-') || $handle === 'outdoor-collection') {
            return 'outdoor';
        }

        if (in_array($handle, [
            'lighting', 'lanterns-chandeliers', 'ceiling-lamps', 'wall-lamps-ceiling-lamps',
            'floor-lamps', 'table-lamps-floor-lamps', 'outdoor-lighting',
        ], true)) {
            return 'lighting';
        }

        if (in_array($handle, [
            'home-fragrance', 'scented-candles', 'home-sprays', 'totems-diffusers',
            'fragrance-accessories', 'refills', 'candle-holders-accessories',
        ], true)) {
            return 'fragrance';
        }

        if (in_array($handle, [
            'textiles', 'decorative-cushions-pillows', 'plaids', 'plaids-bedspreads',
            'rugs-carpets', 'outdoor-carpets',
        ], true)) {
            return 'textile';
        }

        if (in_array($handle, [
            'coffee-table-books-1', 'travel-series', 'design-architecture-1',
            'fashion-luxury-brands-books', 'design-architecture', 'the-ultimate-collection',
            'special-edditions', 'bookends-book-stands',
        ], true)) {
            return 'book';
        }

        if ($handle === 'wallpaper') {
            return 'wallpaper';
        }

        return 'simple';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function navigationTree(): array
    {
        $leaf = fn (string $handle, ?string $template = null): array => [
            'handle' => $handle,
            ...($template ? ['template' => $template] : []),
        ];

        return [
            [
                'handle' => 'home-fragrance',
                'aggregate' => true,
                'template' => 'fragrance',
                'children' => [
                    ['links' => [
                        $leaf('scented-candles', 'fragrance'),
                        $leaf('home-sprays', 'fragrance'),
                        $leaf('totems-diffusers', 'fragrance'),
                        $leaf('fragrance-accessories', 'fragrance'),
                        $leaf('refills', 'fragrance'),
                    ]],
                ],
            ],
            [
                'handle' => 'furniture',
                'aggregate' => true,
                'children' => [
                    [
                        'handle' => 'bedroom',
                        'aggregate' => true,
                        'nav_group' => 'Bedroom',
                        'children' => [
                            $leaf('beds'),
                            $leaf('night-stands'),
                            $leaf('cabinets-dressers-chests'),
                            $leaf('closets'),
                            $leaf('rugs-carpets', 'textile'),
                        ],
                    ],
                    [
                        'handle' => 'sofas',
                        'aggregate' => true,
                        'nav_group' => 'Sofas & Seating',
                        'children' => [
                            $leaf('linear-sofas'),
                            $leaf('corner-sofas'),
                            $leaf('modular-sofas'),
                            $leaf('ottomans'),
                            $leaf('chaise-longues'),
                            $leaf('benches'),
                            $leaf('pouf'),
                        ],
                    ],
                    [
                        'handle' => 'chairs-arm-chairs',
                        'aggregate' => true,
                        'nav_group' => 'Chairs',
                        'children' => [
                            $leaf('armchairs'),
                            $leaf('dining-chairs-bar-stools'),
                            $leaf('office-chairs'),
                            $leaf('bar-counterstools'),
                        ],
                    ],
                    [
                        'handle' => 'tables-desks',
                        'aggregate' => true,
                        'nav_group' => 'Tables & Desks',
                        'children' => [
                            $leaf('coffee-tables'),
                            $leaf('side-tables'),
                            $leaf('dining-tables'),
                            $leaf('console-tables'),
                            $leaf('vanity'),
                            $leaf('desk'),
                        ],
                    ],
                    [
                        'links' => [
                            $leaf('living-systems-bookshelves'),
                            $leaf('single-units'),
                            $leaf('trolleys-bars'),
                            $leaf('leisure'),
                            $leaf('home-office'),
                        ],
                    ],
                ],
            ],
            [
                'handle' => 'lighting',
                'aggregate' => true,
                'template' => 'lighting',
                'children' => [
                    ['links' => [
                        $leaf('lanterns-chandeliers', 'lighting'),
                        $leaf('ceiling-lamps', 'lighting'),
                        $leaf('wall-lamps-ceiling-lamps', 'lighting'),
                        $leaf('floor-lamps', 'lighting'),
                        $leaf('table-lamps-floor-lamps', 'lighting'),
                    ]],
                ],
            ],
            [
                'handle' => 'decor-accessories',
                'aggregate' => true,
                'children' => [
                    [
                        'handle' => 'home-accessories',
                        'aggregate' => true,
                        'nav_group' => 'Home Accessories',
                        'children' => [
                            $leaf('candle-holders-accessories', 'fragrance'),
                            $leaf('coasters'),
                            $leaf('boxes'),
                            $leaf('games'),
                            $leaf('watch-winders'),
                            $leaf('objects'),
                            $leaf('picture-frames'),
                            $leaf('bowls'),
                            $leaf('wallpaper', 'wallpaper'),
                        ],
                    ],
                    [
                        'handle' => 'coffee-table-books-1',
                        'aggregate' => true,
                        'nav_group' => 'Coffee Table Books',
                        'template' => 'book',
                        'children' => [
                            $leaf('travel-series', 'book'),
                            $leaf('design-architecture-1', 'book'),
                            $leaf('fashion-luxury-brands-books', 'book'),
                            $leaf('design-architecture', 'book'),
                            $leaf('the-ultimate-collection', 'book'),
                            $leaf('special-edditions', 'book'),
                            $leaf('bookends-book-stands', 'book'),
                        ],
                    ],
                    [
                        'handle' => 'art-mirrors',
                        'aggregate' => true,
                        'nav_group' => 'Art & Mirrors',
                        'children' => [
                            $leaf('art'),
                            $leaf('mirrors'),
                        ],
                    ],
                    [
                        'handle' => 'textiles',
                        'aggregate' => true,
                        'nav_group' => 'Cushions & Home Textiles',
                        'template' => 'textile',
                        'children' => [
                            $leaf('decorative-cushions-pillows', 'textile'),
                            $leaf('plaids', 'textile'),
                            $leaf('plaids-bedspreads', 'textile'),
                        ],
                    ],
                    [
                        'handle' => 'dining-serveware',
                        'aggregate' => true,
                        'nav_group' => 'Dining Essentials',
                        'children' => [
                            $leaf('dinnerware'),
                            $leaf('drinkware'),
                            $leaf('tabletop-accents'),
                            $leaf('trays-servings'),
                        ],
                    ],
                ],
            ],
            [
                'handle' => 'flowers-vases',
                'aggregate' => true,
                'children' => [
                    ['links' => [
                        $leaf('artificial-flowers-plants'),
                        $leaf('vases'),
                        $leaf('pots-big-vases'),
                    ]],
                ],
            ],
            [
                'handle' => 'outdoor-collection',
                'aggregate' => true,
                'template' => 'outdoor',
                'children' => [
                    [
                        'handle' => 'outdoor-sofas-daybeds',
                        'aggregate' => true,
                        'nav_group' => 'Outdoor Seating',
                        'template' => 'outdoor',
                        'children' => [
                            $leaf('outdoor-linear-sofas', 'outdoor'),
                            $leaf('outdoor-corner-sofas', 'outdoor'),
                            $leaf('outdoor-ottomans', 'outdoor'),
                            $leaf('outdoor-benches', 'outdoor'),
                            $leaf('outdoor-poufs', 'outdoor'),
                        ],
                    ],
                    [
                        'handle' => 'outdoor-daybeds-sunbeds',
                        'aggregate' => true,
                        'nav_group' => 'Daybeds & Sunbeds',
                        'template' => 'outdoor',
                        'children' => [
                            $leaf('outdoor-daybeds', 'outdoor'),
                            $leaf('outdoor-sunbeds', 'outdoor'),
                        ],
                    ],
                    [
                        'handle' => 'outdoor-chairs',
                        'aggregate' => true,
                        'nav_group' => 'Outdoor Chairs',
                        'template' => 'outdoor',
                        'children' => [
                            $leaf('outdoor-dining-chairs', 'outdoor'),
                            $leaf('outdoor-arm-chairs', 'outdoor'),
                        ],
                    ],
                    [
                        'handle' => 'outdoor-tables',
                        'aggregate' => true,
                        'nav_group' => 'Outdoor Tables',
                        'template' => 'outdoor',
                        'children' => [
                            $leaf('outdoor-coffee-table', 'outdoor'),
                            $leaf('outdoor-side-tables', 'outdoor'),
                            $leaf('outdoor-dining-tables', 'outdoor'),
                        ],
                    ],
                    [
                        'links' => [
                            $leaf('outdoor-carpets', 'textile'),
                            $leaf('outdoor-accessories', 'outdoor'),
                            $leaf('outdoor-lighting', 'lighting'),
                        ],
                    ],
                ],
            ],
        ];
    }
}
