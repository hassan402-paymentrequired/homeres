<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StockStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductVariantRequest;
use App\Http\Requests\Admin\UpdateProductVariantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\ProductImageSync;
use App\Services\ProductVariantNaming;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductVariantController extends Controller
{
    public function __construct(
        private ProductVariantNaming $variantNaming,
        private ProductImageSync $imageSync,
    ) {}

    public function create(Product $product): Response
    {
        $product->load([
            'category.productTemplate:id,name,slug,variant_options,rules',
        ]);

        return Inertia::render('admin/products/variant-form', [
            'product' => $this->serializeProduct($product),
            'variant' => null,
            'stockStatuses' => $this->stockStatusOptions(),
            'breadcrumbs' => [
                ...$this->breadcrumbs($product),
                ['id' => 'create-variant', 'name' => 'Add variant', 'href' => route('admin.products.variants.create', $product)],
            ],
        ]);
    }

    public function store(StoreProductVariantRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $variant = $product->variants()->create([
            ...$this->normalizePayload($request, $product, $validated),
            'sort_order' => $this->nextSortOrder($product),
        ]);

        $this->imageSync->syncForVariant($variant, $request);

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Variant created.');
    }

    public function edit(Product $product, ProductVariant $variant): Response
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->load('images');
        $product->load([
            'category.productTemplate:id,name,slug,variant_options,rules',
        ]);

        return Inertia::render('admin/products/variant-form', [
            'product' => $this->serializeProduct($product),
            'variant' => $this->serializeVariant($variant),
            'stockStatuses' => $this->stockStatusOptions(),
            'breadcrumbs' => [
                ...$this->breadcrumbs($product),
                ['id' => $variant->id, 'name' => $variant->name, 'href' => route('admin.products.variants.edit', [$product, $variant])],
            ],
        ]);
    }

    public function update(UpdateProductVariantRequest $request, Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->update($this->normalizePayload($request, $product, $request->validated()));
        $this->imageSync->syncForVariant($variant, $request);

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Variant updated.');
    }

    public function destroy(Product $product, ProductVariant $variant): RedirectResponse
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->delete();

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Variant deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeProduct(Product $product): array
    {
        $template = $product->category?->productTemplate;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'product_template' => $template ? [
                'name' => $template->name,
                'variant_options' => $template->variant_options ?? [],
                'rules' => $template->rules ?? [],
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeVariant(ProductVariant $variant): array
    {
        $variant->loadMissing('images');

        return [
            'id' => $variant->id,
            'name' => $variant->name,
            'sku' => $variant->sku,
            'option_values' => $variant->option_values ?? [],
            'price' => $variant->price,
            'price_on_request' => $variant->price_on_request,
            'stock_status' => $variant->stock_status->value,
            'lead_time_days_air' => $variant->lead_time_days_air,
            'lead_time_days_sea' => $variant->lead_time_days_sea,
            'weight_kg' => $variant->weight_kg,
            'quantity' => $variant->quantity,
            'is_active' => $variant->is_active,
            'images' => $this->imageSync->serialize($variant->images),
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function stockStatusOptions(): array
    {
        return collect(StockStatus::cases())
            ->map(fn (StockStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])
            ->all();
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
    private function normalizePayload(Request $request, Product $product, array $validated): array
    {
        $priceOnRequest = $request->boolean('price_on_request');
        $variantOptions = $this->variantNaming->variantOptionsFor($product);
        $optionValues = $this->variantNaming->normalizeOptionValues(
            is_array($validated['option_values'] ?? null) ? $validated['option_values'] : [],
            $variantOptions,
        );

        $name = $variantOptions !== []
            ? $this->variantNaming->build($optionValues, $variantOptions)
            : $validated['name'];

        return [
            'name' => $name,
            'sku' => $validated['sku'] ?? null,
            'option_values' => $optionValues !== [] ? $optionValues : null,
            'price' => $priceOnRequest ? null : ($validated['price'] ?? null),
            'price_on_request' => $priceOnRequest,
            'stock_status' => $validated['stock_status'],
            'lead_time_days_air' => $validated['stock_status'] === StockStatus::InStockRemote->value
                ? ($validated['lead_time_days_air'] ?? null)
                : null,
            'lead_time_days_sea' => $validated['stock_status'] === StockStatus::InStockRemote->value
                ? ($validated['lead_time_days_sea'] ?? null)
                : null,
            'weight_kg' => $validated['weight_kg'] ?? null,
            'quantity' => $validated['quantity'] ?? null,
            'is_active' => $request->boolean('is_active'),
        ];
    }

    private function nextSortOrder(Product $product): int
    {
        $max = $product->variants()->max('sort_order');

        return ((int) $max) + 1;
    }
}
