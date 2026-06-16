<?php

namespace App\Support\Storefront;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class StorefrontCatalogQuery
{
    /**
     * @param  array{
     *     category?: string|null,
     *     brand?: string|null,
     *     filter?: string|null,
     *     q?: string|null,
     * }  $filters
     * @return Builder<Product>
     */
    public function build(array $filters): Builder
    {
        $query = Product::query()
            ->published()
            ->with([
                'brand',
                'category.productTemplate',
                'images',
                'variants.images',
            ])
            ->ordered();

        if (filled($filters['q'] ?? null)) {
            $term = '%'.mb_strtolower(trim((string) $filters['q'])).'%';
            $query->where(function (Builder $builder) use ($term): void {
                $builder->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(description) LIKE ?', [$term])
                    ->orWhereHas('brand', fn (Builder $brand) => $brand->whereRaw('LOWER(name) LIKE ?', [$term]))
                    ->orWhereHas('category', fn (Builder $category) => $category->whereRaw('LOWER(name) LIKE ?', [$term]));
            });
        }

        if (filled($filters['brand'] ?? null)) {
            $brand = Brand::query()
                ->where('handle', $filters['brand'])
                ->where('is_active', true)
                ->first();

            if ($brand === null) {
                return $query->whereRaw('0 = 1');
            }

            $query->where('brand_id', $brand->id);
        }

        if (filled($filters['category'] ?? null)) {
            $categoryIds = $this->categoryIdsForHandle((string) $filters['category']);

            if ($categoryIds->isEmpty()) {
                return $query->whereRaw('0 = 1');
            }

            $query->whereIn('category_id', $categoryIds);
        }

        if (($filters['filter'] ?? null) === 'new') {
            $query->where('created_at', '>=', now()->subDays(60));
        }

        return $query;
    }

    public function applyRefine(Builder $query, bool $newOnly, ?int $maxPrice, bool $alreadyNewFilter): void
    {
        if ($newOnly && ! $alreadyNewFilter) {
            $query->where('created_at', '>=', now()->subDays(60));
        }

        if ($maxPrice !== null && $maxPrice > 0) {
            $query->whereHas(
                'variants',
                fn (Builder $variant) => $variant
                    ->where('is_active', true)
                    ->whereNotNull('price')
                    ->where('price', '>', 0)
                    ->where('price', '<=', $maxPrice),
            );
        }
    }

    public function applySubcategory(Builder $query, string $handle): void
    {
        $category = Category::query()
            ->where('handle', $handle)
            ->where('is_active', true)
            ->first();

        if ($category === null) {
            $query->whereRaw('0 = 1');

            return;
        }

        $query->where('category_id', $category->id);
    }

    public function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'name' => $query->reorder()->orderBy('name'),
            'price-asc' => $query->reorder()->orderByRaw(
                '(select min(price) from product_variants where product_variants.product_id = products.id and product_variants.is_active = 1 and product_variants.price is not null and product_variants.price > 0) asc'
            )->orderBy('name'),
            'price-desc' => $query->reorder()->orderByRaw(
                '(select min(price) from product_variants where product_variants.product_id = products.id and product_variants.is_active = 1 and product_variants.price is not null and product_variants.price > 0) desc'
            )->orderBy('name'),
            default => null,
        };
    }

    /**
     * @return Collection<int, string>
     */
    public function categoryIdsForHandle(string $handle): Collection
    {
        $category = Category::query()
            ->where('handle', $handle)
            ->where('is_active', true)
            ->first();

        if ($category === null) {
            return collect();
        }

        $ids = collect([$category->id]);
        $this->collectDescendantIds($category->id, $ids);

        return $ids->unique()->values();
    }

    /**
     * @param  Collection<int, string>  $ids
     */
    private function collectDescendantIds(string $parentId, Collection $ids): void
    {
        $children = Category::query()
            ->where('parent_id', $parentId)
            ->where('is_active', true)
            ->pluck('id');

        foreach ($children as $childId) {
            $ids->push($childId);
            $this->collectDescendantIds($childId, $ids);
        }
    }
}
