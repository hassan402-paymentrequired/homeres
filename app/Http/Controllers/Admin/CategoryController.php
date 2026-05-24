<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTemplate;
use App\Services\CategoryHandleGenerator;
use App\Services\CategoryTree;
use App\Services\ProductPresenter;
use App\Support\AdminPagination;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryTree $categoryTree,
        private CategoryHandleGenerator $handleGenerator,
        private ProductPresenter $productPresenter,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => $this->categoryTree->paginatedCardsForParent(),
            'productTemplates' => $this->productTemplateOptions()->values()->all(),
        ]);
    }

    public function show(Category $category): Response
    {
        $category->load(['productTemplate:id,name,slug', 'parent:id,name']);

        return Inertia::render('admin/categories/show', [
            'category' => $this->categoryTree->serializeCard($category),
            'stats' => $this->categoryTree->stats($category),
            'subcategories' => $this->categoryTree->paginatedCardsForParent($category->id),
            'products' => $this->paginatedProductsForCategory($category),
            'breadcrumbs' => $this->categoryTree->breadcrumbs($category)->values()->all(),
            'productTemplates' => $this->productTemplateOptions()->values()->all(),
        ]);
    }

    public function create(Request $request): Response
    {
        $parent = $request->filled('parent')
            ? Category::query()->findOrFail($request->string('parent')->toString())
            : null;

        return Inertia::render('admin/categories/form', [
            'category' => null,
            'parentCategory' => $parent ? $this->categoryTree->serialize($parent) : null,
            'productTemplates' => $this->productTemplateOptions(),
            'breadcrumbs' => $parent
                ? $this->categoryTree->breadcrumbs($parent)->push([
                    'id' => 'create',
                    'name' => 'Add subcategory',
                    'href' => route('admin.categories.create', ['parent' => $parent->id]),
                ])->values()->all()
                : [
                    ['id' => '', 'name' => 'Categories', 'href' => route('admin.categories.index')],
                    ['id' => 'create', 'name' => 'Add category', 'href' => route('admin.categories.create')],
                ],
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $parentId = filled($validated['parent_id'] ?? null) ? $validated['parent_id'] : null;

        $category = Category::query()->create([
            ...$this->normalizePayload($request, $validated),
            'handle' => $this->handleGenerator->generate($validated['name']),
            'parent_id' => $parentId,
            'sort_order' => $this->nextSortOrder($parentId),
            'is_aggregate' => false,
        ]);

        $redirect = $parentId
            ? route('admin.categories.show', $parentId)
            : route('admin.categories.show', $category);

        return redirect($redirect)->with('success', 'Category created.');
    }

    public function edit(Category $category): Response
    {
        $category->load(['productTemplate:id,name,slug', 'parent:id,name']);

        return Inertia::render('admin/categories/form', [
            'category' => $this->categoryTree->serialize($category),
            'parentCategory' => $category->parent
                ? $this->categoryTree->serialize($category->parent)
                : null,
            'productTemplates' => $this->productTemplateOptions(),
            'breadcrumbs' => $this->categoryTree->breadcrumbs($category)->push([
                'id' => 'edit',
                'name' => 'Edit',
                'href' => route('admin.categories.edit', $category),
            ])->values()->all(),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update($this->normalizePayload($request, $validated));

        return redirect()
            ->route('admin.categories.show', $category)
            ->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->children()->exists()) {
            return back()->with('error', 'Remove or reassign subcategories before deleting this category.');
        }

        $parentId = $category->parent_id;
        $category->delete();

        if ($parentId !== null) {
            return redirect()
                ->route('admin.categories.show', $parentId)
                ->with('success', 'Category deleted.');
        }

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted.');
    }

    /**
     * @return LengthAwarePaginator<int, array<string, mixed>>
     */
    private function paginatedProductsForCategory(Category $category): LengthAwarePaginator
    {
        return Product::query()
            ->with(['category:id,name', 'brand:id,name', 'images'])
            ->withCount('variants')
            ->where('category_id', $category->id)
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Product $product): array => $this->productPresenter->card($product));
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function normalizePayload(Request $request, array $validated): array
    {
        return [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'nav_group_label' => $validated['nav_group_label'] ?? null,
            'product_template_id' => filled($validated['product_template_id'] ?? null)
                ? $validated['product_template_id']
                : null,
            'is_active' => $request->boolean('is_active'),
            'show_in_nav' => $request->boolean('show_in_nav'),
        ];
    }

    private function nextSortOrder(?string $parentId): int
    {
        $max = Category::query()->where('parent_id', $parentId)->max('sort_order');

        return ((int) $max) + 1;
    }

    /**
     * @return Collection<int, array{id: string, name: string}>
     */
    private function productTemplateOptions(): Collection
    {
        return ProductTemplate::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (ProductTemplate $template): array => [
                'id' => $template->id,
                'name' => $template->name,
            ]);
    }
}
