<?php

namespace App\Support\Storefront;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Collection;

final class StorefrontNavigationBuilder
{
    /**
     * Root mega menu categories (mirrors CategorySeeder navigation tree).
     *
     * @var list<string>
     */
    private const PRIMARY_ROOT_HANDLES = [
        'home-fragrance',
        'furniture',
        'lighting',
        'decor-accessories',
        'flowers-vases',
        'outdoor-collection',
    ];

    /**
     * Top-level mega menu entries promoted from nested aggregates (matches curated nav).
     *
     * @var list<string>
     */
    private const PROMOTED_TOP_LEVEL_HANDLES = [
        'coffee-table-books-1',
        'art-mirrors',
    ];

    /**
     * @return list<array<string, mixed>>
     */
    public function build(): array
    {
        $navigation = [
            [
                'label' => 'Shop All',
                'href' => route('shop'),
            ],
        ];

        foreach ($this->primaryNavCategories() as $category) {
            $navigation[] = $this->buildCategoryItem($category);
        }

        $navigation[] = [
            'label' => 'View all Brands',
            'href' => route('brands'),
            'brandGroups' => $this->brandGroups(),
        ];

        foreach ($this->staticPages() as $page) {
            $navigation[] = $page;
        }

        return $navigation;
    }

    /**
     * @return Collection<int, Category>
     */
    private function primaryNavCategories(): Collection
    {
        $withTree = [
            'children' => fn ($query) => $query->inNav()->ordered()->with([
                'children' => fn ($childQuery) => $childQuery->inNav()->ordered(),
            ]),
        ];

        $handles = [...self::PRIMARY_ROOT_HANDLES, ...self::PROMOTED_TOP_LEVEL_HANDLES];

        return Category::query()
            ->inNav()
            ->whereIn('handle', $handles)
            ->with($withTree)
            ->ordered()
            ->get()
            ->sortBy(fn (Category $category): int => array_search($category->handle, $handles, true) ?: 999)
            ->values();
    }

    /**
     * @return array<string, mixed>
     */
    private function buildCategoryItem(Category $category): array
    {
        $label = $this->navLabel($category->name);

        /** @var Collection<int, Category> $children */
        $children = $category->children;

        if ($children->isEmpty()) {
            return [
                'label' => $label,
                'handle' => $category->handle,
            ];
        }

        if ($children->every(fn (Category $child): bool => $child->children->isEmpty())) {
            return [
                'label' => $label,
                'handle' => $category->handle,
                'links' => $this->mapLinks($children),
            ];
        }

        $columns = [];
        $ungrouped = [];

        foreach ($children as $child) {
            $grandchildren = $child->children;

            if ($grandchildren->isNotEmpty()) {
                $columns[] = [
                    'title' => $this->navLabel($child->nav_group_label ?: $child->name),
                    'titleHandle' => $child->is_aggregate ? $child->handle : null,
                    'links' => $this->mapLinks($grandchildren),
                ];

                continue;
            }

            $ungrouped[] = [
                'label' => $this->navLabel($child->name),
                'handle' => $child->handle,
            ];
        }

        if ($ungrouped !== []) {
            $columns[] = ['links' => $ungrouped];
        }

        return [
            'label' => $label,
            'handle' => $category->handle,
            'columns' => $columns,
        ];
    }

    private function navLabel(string $name): string
    {
        $cleaned = preg_replace('/\s*\(All\)\s*$/i', '', $name);

        return is_string($cleaned) && $cleaned !== '' ? $cleaned : $name;
    }

    /**
     * @param  Collection<int, Category>  $categories
     * @return list<array{label: string, handle: string}>
     */
    private function mapLinks(Collection $categories): array
    {
        return $categories
            ->map(fn (Category $category): array => [
                'label' => $this->navLabel($category->name),
                'handle' => $category->handle,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{title: string, links: list<array{label: string, handle: string}>}>
     */
    private function brandGroups(): array
    {
        $brands = Brand::query()
            ->where('is_active', true)
            ->where('show_in_nav', true)
            ->ordered()
            ->get(['name', 'handle']);

        return [
            $this->brandGroup('Brands A–B', $brands, 'A', 'B'),
            $this->brandGroup('Brands C–I', $brands, 'C', 'I'),
            $this->brandGroup('Brands J–R', $brands, 'J', 'R'),
            $this->brandGroup('Brands S–Z', $brands, 'S', 'Z'),
        ];
    }

    /**
     * @return array{title: string, links: list<array{label: string, handle: string}>}
     */
    private function brandGroup(string $title, Collection $brands, string $from, string $to): array
    {
        $links = $brands
            ->filter(function (Brand $brand) use ($from, $to): bool {
                $letter = strtoupper(substr($brand->name, 0, 1));

                if (! ctype_alpha($letter)) {
                    return $from === 'A';
                }

                return $letter >= $from && $letter <= $to;
            })
            ->map(fn (Brand $brand): array => [
                'label' => $brand->name,
                'handle' => $brand->handle,
            ])
            ->values()
            ->all();

        return [
            'title' => $title,
            'links' => $links,
        ];
    }

    /**
     * @return list<array{label: string, href: string}>
     */
    private function staticPages(): array
    {
        return [
            ['label' => 'Design Studio', 'href' => route('services')],
            ['label' => 'About', 'href' => route('about')],
            ['label' => 'Contact', 'href' => route('contact')],
        ];
    }
}
