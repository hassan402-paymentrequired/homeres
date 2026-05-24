<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\ProductHandleGenerator;
use App\Services\ProductImageSync;
use App\Services\ProductPresenter;
use App\Support\AdminPagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductHandleGenerator $handleGenerator,
        private ProductImageSync $imageSync,
        private ProductPresenter $productPresenter,
    ) {}

    public function index(): Response
    {
        $products = Product::query()
            ->with(['category:id,name', 'brand:id,name', 'images'])
            ->withCount('variants')
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Product $product): array => $this->productPresenter->card($product));

        return Inertia::render('admin/products/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load([
            'category:id,name,product_template_id',
            'category.productTemplate:id,name,slug,spec_fields,variant_options,rules',
            'brand:id,name',
            'images',
        ]);

        $variants = $product->variants()
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn ($variant): array => $this->serializeVariant($variant));

        return Inertia::render('admin/products/show', [
            'product' => $this->serialize($product),
            'stats' => $this->stats($product),
            'variants' => $variants,
            'breadcrumbs' => $this->breadcrumbs($product),
        ]);
    }

    public function create(Request $request): Response
    {
        $prefillCategory = $request->filled('category')
            ? Category::query()->find($request->string('category')->toString())
            : null;
        $prefillBrand = $request->filled('brand')
            ? Brand::query()->find($request->string('brand')->toString())
            : null;

        return Inertia::render('admin/products/form', [
            'product' => null,
            'prefillCategoryId' => $prefillCategory?->id,
            'prefillBrandId' => $prefillBrand?->id,
            'categories' => $this->categoryOptions(),
            'brands' => $this->brandOptions(),
            'breadcrumbs' => [
                ['id' => '', 'name' => 'Products', 'href' => route('admin.products.index')],
                ['id' => 'create', 'name' => 'Add product', 'href' => route('admin.products.create')],
            ],
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $product = Product::query()->create([
            ...$this->normalizePayload($request, $validated),
            'handle' => $this->handleGenerator->generate($validated['name']),
            'sort_order' => $this->nextSortOrder(),
        ]);

        $this->imageSync->sync($product, $request);

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Product created. Add variants to complete the listing.');
    }

    public function edit(Product $product): Response
    {
        $product->load([
            'category:id,name,product_template_id',
            'category.productTemplate:id,name,slug,spec_fields,variant_options,rules',
            'brand:id,name',
            'images',
        ]);

        return Inertia::render('admin/products/form', [
            'product' => $this->serialize($product),
            'prefillCategoryId' => null,
            'prefillBrandId' => null,
            'categories' => $this->categoryOptions(),
            'brands' => $this->brandOptions(),
            'breadcrumbs' => [
                ...$this->breadcrumbs($product),
                ['id' => 'edit', 'name' => 'Edit', 'href' => route('admin.products.edit', $product)],
            ],
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($this->normalizePayload($request, $request->validated()));

        $this->imageSync->sync($product, $request);

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->imageSync->deleteAll($product);
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    public function serialize(Product $product): array
    {
        $category = $product->relationLoaded('category') ? $product->category : null;
        $template = $category?->relationLoaded('productTemplate') ? $category->productTemplate : null;

        return [
            'id' => $product->id,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id,
            'name' => $product->name,
            'description' => $product->description,
            'specs' => $product->specs ?? [],
            'status' => $product->is_active ? 'published' : 'draft',
            'is_active' => $product->is_active,
            'images' => $this->imageSync->serialize($product->images),
            'category' => $category ? [
                'id' => $category->id,
                'name' => $category->name,
            ] : null,
            'brand' => $product->relationLoaded('brand') && $product->brand ? [
                'id' => $product->brand->id,
                'name' => $product->brand->name,
            ] : null,
            'product_template' => $template ? [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'spec_fields' => $template->spec_fields ?? [],
                'variant_options' => $template->variant_options ?? [],
                'rules' => $template->rules ?? [],
            ] : null,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeVariant(ProductVariant $variant): array
    {
        return [
            'id' => $variant->id,
            'name' => $variant->name,
            'sku' => $variant->sku,
            'price' => $variant->price,
            'price_on_request' => $variant->price_on_request,
            'stock_status' => $variant->stock_status->value,
            'stock_status_label' => $variant->stock_status->label(),
            'lead_time_days_air' => $variant->lead_time_days_air,
            'lead_time_days_sea' => $variant->lead_time_days_sea,
            'weight_kg' => $variant->weight_kg,
            'quantity' => $variant->quantity,
            'is_active' => $variant->is_active,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function stats(Product $product): array
    {
        $variants = $product->variants();

        return [
            'variants_count' => (clone $variants)->count(),
            'in_store_count' => (clone $variants)->where('stock_status', 'in_store')->count(),
            'remote_stock_count' => (clone $variants)->where('stock_status', 'in_stock_remote')->count(),
            'out_of_stock_count' => (clone $variants)->where('stock_status', 'out_of_stock')->count(),
        ];
    }

    /**
     * @return array<int, array{id: string, name: string, href: string}>
     */
    private function breadcrumbs(Product $product): array
    {
        return [
            ['id' => '', 'name' => 'Products', 'href' => route('admin.products.index')],
            ['id' => $product->id, 'name' => $product->name, 'href' => route('admin.products.show', $product)],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function normalizePayload(Request $request, array $validated): array
    {
        return [
            'category_id' => $validated['category_id'],
            'brand_id' => filled($validated['brand_id'] ?? null) ? $validated['brand_id'] : null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'specs' => $validated['specs'] ?? null,
            'is_active' => ($validated['status'] ?? 'draft') === 'published',
        ];
    }

    private function nextSortOrder(): int
    {
        $max = Product::query()->max('sort_order');

        return ((int) $max) + 1;
    }

    /**
     * @return Collection<int, array{id: string, name: string, product_template: array<string, mixed>|null}>
     */
    private function categoryOptions(): Collection
    {
        return Category::query()
            ->with('productTemplate:id,name,slug,spec_fields,variant_options,rules')
            ->ordered()
            ->get(['id', 'name', 'parent_id', 'product_template_id'])
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'product_template' => $category->productTemplate ? [
                    'id' => $category->productTemplate->id,
                    'name' => $category->productTemplate->name,
                    'slug' => $category->productTemplate->slug,
                    'spec_fields' => $category->productTemplate->spec_fields ?? [],
                    'variant_options' => $category->productTemplate->variant_options ?? [],
                    'rules' => $category->productTemplate->rules ?? [],
                ] : null,
            ]);
    }

    /**
     * @return Collection<int, array{id: string, name: string}>
     */
    private function brandOptions(): Collection
    {
        return Brand::query()
            ->ordered()
            ->get(['id', 'name'])
            ->map(fn (Brand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
            ]);
    }
}
