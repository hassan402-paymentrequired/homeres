<?php

namespace App\Services\Storefront;

use App\Http\Requests\Storefront\ShopIndexRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Support\Storefront\StorefrontCatalogQuery;
use App\Support\Storefront\StorefrontPagination;
use App\Support\Storefront\StorefrontProductPresenter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class ShopPageService
{
    /**
     * Root handles shown in the shop sidebar (aligned with mega menu).
     *
     * @var list<string>
     */
    private const SIDEBAR_CATEGORY_HANDLES = [
        'home-fragrance',
        'furniture',
        'lighting',
        'decor-accessories',
        'flowers-vases',
        'outdoor-collection',
        'coffee-table-books-1',
        'art-mirrors',
    ];

    public function __construct(
        private StorefrontCatalogQuery $catalogQuery,
        private StorefrontProductPresenter $presenter,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function build(ShopIndexRequest $request): array
    {
        $view = $this->resolveView($request);

        if ($view === 'brands') {
            return $this->brandDirectoryPage();
        }

        $filters = $this->catalogFilters($request);
        $products = $this->paginatedProducts($request, $filters);
        $category = $this->resolveCategory($filters['category']);
        $brand = $this->resolveBrand($filters['brand']);


        return [
            'products' => $products,
            'catalog' => [
                'view' => $view,
                'title' => $this->pageTitle($view, $category, $brand, $filters, $request),
                'description' => $category?->description ?? $brand?->description,
                'filters' => [
                    'category' => $filters['category'],
                    'brand' => $filters['brand'],
                    'filter' => $filters['filter'],
                    'q' => $filters['q'],
                    'sub' => $request->subcategoryHandle(),
                    'sort' => $request->sort(),
                    'new_only' => $request->newOnly(),
                    'max_price' => $request->maxPrice(),
                ],
                'basePath' => '/'.ltrim($request->path(), '/'),
                'sidebarCategories' => $this->sidebarCategories(),
                'categoryContext' => $category ? $this->categoryContext($category) : null,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function brandDirectoryPage(): array
    {
        $brands = Brand::query()
            ->where('is_active', true)
            ->where('show_in_nav', true)
            ->ordered()
            ->get(['name', 'handle']);

        return [
            'products' => $this->emptyPaginator(),
            'catalog' => [
                'view' => 'brands',
                'title' => 'Brands',
                'description' => 'Browse luxury furniture and home decor by designer brand.',
                'filters' => [
                    'category' => null,
                    'brand' => null,
                    'filter' => null,
                    'q' => null,
                    'sub' => null,
                    'sort' => 'featured',
                    'new_only' => false,
                    'max_price' => null,
                ],
                'basePath' => '/brands',
                'sidebarCategories' => $this->sidebarCategories(),
                'categoryContext' => null,
                'brands' => $brands->map(fn (Brand $brand): array => [
                    'name' => $brand->name,
                    'handle' => $brand->handle,
                    'href' => route('brands.show', $brand->handle),
                ])->values()->all(),
            ],
        ];
    }

    /**
     * @return array{category: string|null, brand: string|null, filter: string|null, q: string|null}
     */
    private function catalogFilters(ShopIndexRequest $request): array
    {
        return [
            'category' => match (true) {
                $request->routeIs('collections.show') => $request->route('handle'),
                $request->routeIs('shop.category') => $request->route('category'),
                default => null,
            },
            'brand' => $request->routeIs('brands.show') ? $request->route('handle') : null,
            'filter' => $request->routeIs('shop.new') ? 'new' : null,
            'q' => $request->searchQuery(),
        ];
    }

    /**
     * @param  array{category: string|null, brand: string|null, filter: string|null, q: string|null}  $filters
     */
    private function paginatedProducts(ShopIndexRequest $request, array $filters): LengthAwarePaginator
    {
        $query = $this->catalogQuery->build($filters);

        if ($sub = $request->subcategoryHandle()) {
            $this->catalogQuery->applySubcategory($query, $sub);
        }

        $this->catalogQuery->applyRefine(
            $query,
            $request->newOnly(),
            $request->maxPrice(),
            ($filters['filter'] ?? null) === 'new',
        );

        $this->catalogQuery->applySort($query, $request->sort());

        return $query
            ->paginate(StorefrontPagination::PER_PAGE)
            ->withQueryString()
            ->through(fn ($product): array => $this->presenter->card($product));
    }

    private function resolveView(Request $request): string
    {
        if ($request->routeIs('brands') && ! $request->route('handle')) {
            return 'brands';
        }

        if ($request->routeIs('shop.new')) {
            return 'new';
        }

        if ($request->routeIs('collections.show')) {
            return 'collection';
        }

        if ($request->routeIs('shop.category')) {
            return 'category';
        }

        if ($request->routeIs('brands.show')) {
            return 'brand';
        }

        return 'shop';
    }

    /**
     * @param  array{category: string|null, brand: string|null, filter: string|null, q: string|null}  $filters
     */
    private function pageTitle(
        string $view,
        ?Category $category,
        ?Brand $brand,
        array $filters,
        ShopIndexRequest $request,
    ): string {
        if (filled($filters['q'])) {
            return 'Search: '.$filters['q'];
        }

        return match ($view) {
            'new' => 'New arrivals',
            'brand' => $brand?->name ?? 'Brand',
            'category', 'collection' => $category?->name ?? 'Shop',
            default => 'Shop',
        };
    }

    private function resolveCategory(?string $handle): ?Category
    {
        if (! filled($handle)) {
            return null;
        }

        return Category::query()
            ->where('handle', $handle)
            ->where('is_active', true)
            ->with([
                'children' => fn ($query) => $query->inNav()->ordered(),
            ])
            ->first();
    }

    private function resolveBrand(?string $handle): ?Brand
    {
        if (! filled($handle)) {
            return null;
        }

        return Brand::query()
            ->where('handle', $handle)
            ->where('is_active', true)
            ->first();
    }

    /**
     * @return list<array{label: string, handle: string, href: string}>
     */
    private function sidebarCategories(): array
    {
        return Category::query()
            ->inNav()
            ->whereIn('handle', self::SIDEBAR_CATEGORY_HANDLES)
            ->ordered()
            ->get(['name', 'handle'])
            ->sortBy(fn (Category $category): int => array_search($category->handle, self::SIDEBAR_CATEGORY_HANDLES, true) ?: 999)
            ->values()
            ->map(fn (Category $category): array => [
                'label' => $this->cleanLabel($category->name),
                'handle' => $category->handle,
                'href' => route('shop.category', $category->handle),
            ])
            ->all();
    }

    /**
     * @return array{handle: string, label: string, children: list<array{label: string, handle: string}>}
     */
    private function categoryContext(Category $category): array
    {
        return [
            'handle' => $category->handle,
            'label' => $this->cleanLabel($category->name),
            'children' => $category->children
                ->map(fn (Category $child): array => [
                    'label' => $this->cleanLabel($child->name),
                    'handle' => $child->handle,
                ])
                ->values()
                ->all(),
        ];
    }

    private function cleanLabel(string $name): string
    {
        $cleaned = preg_replace('/\s*\(All\)\s*$/i', '', $name);

        return is_string($cleaned) && $cleaned !== '' ? $cleaned : $name;
    }

    /**
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    private function emptyPaginator(): LengthAwarePaginator
    {
        return new \Illuminate\Pagination\LengthAwarePaginator(
            [],
            0,
            StorefrontPagination::PER_PAGE,
            1,
            ['path' => request()->url(), 'query' => request()->query()],
        );
    }
}
