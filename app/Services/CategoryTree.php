<?php

namespace App\Services;

use App\Models\Category;
use App\Support\AdminPagination;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CategoryTree
{
    public function __construct(private CategoryCatalog $catalog) {}

    /**
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    public function paginatedCardsForParent(?string $parentId = null): LengthAwarePaginator
    {
        return Category::query()
            ->with('productTemplate:id,name,slug')
            ->withCount('children')
            ->where('parent_id', $parentId)
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Category $category): array => $this->serializeCard($category));
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeCard(Category $category): array
    {
        return [
            ...$this->serialize($category),
            'children_count' => (int) ($category->children_count ?? $category->children()->count()),
            'product_count' => $this->catalog->productCountFor($category->handle),
        ];
    }

    /**
     * @return Collection<int, array{id: string, name: string, href: string}>
     */
    public function breadcrumbs(Category $category): Collection
    {
        $trail = collect();
        $current = $category;

        while ($current !== null) {
            $trail->prepend([
                'id' => $current->id,
                'name' => $current->name,
                'href' => route('admin.categories.show', $current),
            ]);

            $current = $current->parent_id
                ? Category::query()->find($current->parent_id)
                : null;
        }

        return $trail->prepend([
            'id' => '',
            'name' => 'Categories',
            'href' => route('admin.categories.index'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function stats(Category $category): array
    {
        $children = Category::query()->where('parent_id', $category->id);

        return [
            'product_count' => $this->catalog->productCountFor($category->handle),
            'subcategories_count' => (clone $children)->count(),
            'active_subcategories_count' => (clone $children)->where('is_active', true)->count(),
            'nav_visible_subcategories_count' => (clone $children)->where('show_in_nav', true)->count(),
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function build(?string $excludeId = null): Collection
    {
        $categories = Category::query()
            ->with('productTemplate:id,name,slug')
            ->ordered()
            ->get();

        if ($excludeId !== null) {
            $descendantIds = $this->descendantIds($categories, $excludeId);
            $categories = $categories->reject(
                fn (Category $category): bool => $category->id === $excludeId
                    || $descendantIds->contains($category->id),
            );
        }

        return $this->nest($categories);
    }

    /**
     * @param  Collection<int, Category>  $categories
     * @return Collection<int, array<string, mixed>>
     */
    private function nest(Collection $categories, ?string $parentId = null): Collection
    {
        return $categories
            ->where('parent_id', $parentId)
            ->values()
            ->map(function (Category $category) use ($categories): array {
                return [
                    ...$this->serialize($category),
                    'children' => $this->nest($categories, $category->id)->all(),
                ];
            });
    }

    /**
     * @param  Collection<int, Category>  $categories
     * @return Collection<int, string>
     */
    private function descendantIds(Collection $categories, string $categoryId): Collection
    {
        $ids = collect();

        $walk = function (string $parentId) use ($categories, &$walk, &$ids): void {
            foreach ($categories->where('parent_id', $parentId) as $child) {
                $ids->push($child->id);
                $walk($child->id);
            }
        };

        $walk($categoryId);

        return $ids;
    }

    /**
     * @return array<string, mixed>
     */
    public function serialize(Category $category): array
    {
        return [
            'id' => $category->id,
            'parent_id' => $category->parent_id,
            'product_template_id' => $category->product_template_id,
            'name' => $category->name,
            'description' => $category->description,
            'banner_path' => $category->banner_path,
            'banner_url' => $category->banner_url,
            'nav_group_label' => $category->nav_group_label,
            'is_active' => $category->is_active,
            'show_in_nav' => $category->show_in_nav,
            'product_template' => $category->productTemplate ? [
                'id' => $category->productTemplate->id,
                'name' => $category->productTemplate->name,
            ] : null,
            'created_at' => $category->created_at?->toIso8601String(),
            'updated_at' => $category->updated_at?->toIso8601String(),
        ];
    }
}
