<?php

namespace App\Support\Storefront;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductTemplate;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;

final class StorefrontProductPresenter
{
    public function __construct(
        private ProductImageUrl $imageUrl,
        private StorefrontCurrencyResolver $currencyResolver,
        private StorefrontPriceConverter $priceConverter,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function card(Product $product): array
    {
        $this->loadCatalogRelations($product);

        $variant = $this->displayVariant($product);
        $pricing = $this->presentPricing($product, $variant);

        return [
            'id' => $product->id,
            'handle' => $product->handle,
            'name' => $product->name,
            'brand' => $product->brand?->name ?? '',
            'brandHandle' => $product->brand?->handle ?? '',
            'price' => $pricing['price'],
            'priceFormatted' => $pricing['priceFormatted'],
            'priceOnRequest' => $pricing['priceOnRequest'],
            'currency' => $pricing['currency'],
            'category' => $this->categoryLabel($product),
            'categorySlug' => $product->category?->handle ?? '',
            'description' => (string) ($product->description ?? ''),
            'images' => $this->resolveGallery($product, $variant),
            'isNew' => $product->created_at?->greaterThan(now()->subDays(60)) ?? false,
            'defaultVariantId' => $variant?->id,
            'href' => route('products.show', $product),
            'template' => $this->template($product),
        ];
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return list<array<string, mixed>>
     */
    public function cards(Collection $products): array
    {
        return $products->map(fn (Product $product): array => $this->card($product))->values()->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function detail(Product $product): array
    {
        $this->loadCatalogRelations($product);

        $variant = $this->displayVariant($product);
        $card = $this->card($product);
        $specRows = $this->specsForDisplay($product);

        return [
            ...$card,
            'details' => $this->detailsFromSpecRows($specRows),
            'specs' => $specRows,
            'variants' => $product->variants
                ->where('is_active', true)
                ->values()
                ->map(fn (ProductVariant $item): array => $this->variant($item, $product))
                ->all(),
            'sku' => $variant?->sku,
            'dimensions' => $this->specValue($product, 'dimensions'),
            'material' => $this->specValue($product, 'material', 'materials'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function variant(ProductVariant $variant, ?Product $product = null): array
    {
        $variant->loadMissing(['images', 'product']);
        $product ??= $variant->product;
        $pricing = $this->presentPricing($product, $variant);

        return [
            'id' => $variant->id,
            'name' => $variant->name,
            'sku' => $variant->sku,
            'price' => $pricing['price'],
            'priceFormatted' => $pricing['priceFormatted'],
            'priceOnRequest' => $pricing['priceOnRequest'],
            'currency' => $pricing['currency'],
            'stockStatus' => $variant->stock_status->value,
            'stockStatusLabel' => $variant->stock_status->label(),
            'leadTimeDaysAir' => $variant->lead_time_days_air,
            'leadTimeDaysSea' => $variant->lead_time_days_sea,
            'optionValues' => $variant->option_values ?? [],
            'images' => $this->mapImages($variant->images, $product->name),
        ];
    }

    private function loadCatalogRelations(Product $product): void
    {
        $product->loadMissing([
            'brand',
            'category.productTemplate',
            'images',
            'variants.images',
        ]);
    }

    private function displayVariant(Product $product): ?ProductVariant
    {
        $active = $product->variants->where('is_active', true);

        if ($active->isEmpty()) {
            return $product->variants->first();
        }

        $priced = $active->filter(
            fn (ProductVariant $variant): bool => ! $variant->price_on_request
                && $variant->price !== null
                && (float) $variant->price > 0,
        );

        if ($priced->isNotEmpty()) {
            return $priced->sortBy(fn (ProductVariant $variant): float => (float) $variant->price)->first();
        }

        return $active->first() ?? $product->variants->first();
    }

    /**
     * @return array{slug: string, name: string, specFields: list<array<string, mixed>>, variantOptions: list<array<string, mixed>>, rules: array<string, mixed>}|null
     */
    private function template(Product $product): ?array
    {
        $template = $product->category?->productTemplate;

        if (! $template instanceof ProductTemplate) {
            return null;
        }

        return [
            'slug' => $template->slug,
            'name' => $template->name,
            'specFields' => $template->spec_fields ?? [],
            'variantOptions' => $template->variant_options ?? [],
            'rules' => $template->rules ?? [],
        ];
    }

    /**
     * @return list<array{key: string, label: string, value: string, type: string}>
     */
    private function specsForDisplay(Product $product): array
    {
        if (! is_array($product->specs)) {
            return [];
        }

        $template = $product->category?->productTemplate;
        $fields = $template?->spec_fields ?? [];

        if ($fields === []) {
            return collect($product->specs)
                ->except(['dimensions', 'material', 'materials', 'currency'])
                ->filter(fn ($value): bool => filled($value))
                ->map(fn ($value, string $key): array => [
                    'key' => $key,
                    'label' => str($key)->replace('_', ' ')->title()->toString(),
                    'value' => (string) $value,
                    'type' => 'text',
                ])
                ->values()
                ->all();
        }

        return collect($fields)
            ->sortBy('position')
            ->map(function (array $field) use ($product): array {
                $key = (string) ($field['key'] ?? '');
                $value = $product->specs[$key] ?? null;

                return [
                    'key' => $key,
                    'label' => (string) ($field['label'] ?? $key),
                    'value' => is_scalar($value) || $value === null ? (string) ($value ?? '') : '',
                    'type' => (string) ($field['type'] ?? 'text'),
                ];
            })
            ->filter(fn (array $row): bool => filled($row['value']))
            ->values()
            ->all();
    }

    /**
     * @param  list<array{key: string, label: string, value: string, type: string}>  $rows
     * @return list<string>
     */
    private function detailsFromSpecRows(array $rows): array
    {
        return collect($rows)
            ->map(fn (array $row): string => $row['label'].': '.$row['value'])
            ->values()
            ->all();
    }

    private function specValue(Product $product, string ...$keys): ?string
    {
        if (! is_array($product->specs)) {
            return null;
        }

        foreach ($keys as $key) {
            $value = $product->specs[$key] ?? null;

            if (filled($value)) {
                return (string) $value;
            }
        }

        return null;
    }

    private function categoryLabel(Product $product): string
    {
        $name = $product->category?->name ?? '';

        if ($name === '') {
            return '';
        }

        $cleaned = preg_replace('/\s*\(All\)\s*$/i', '', $name);

        return is_string($cleaned) && $cleaned !== '' ? $cleaned : $name;
    }

    private function sourceCurrency(Product $product): string
    {
        if (! is_array($product->specs)) {
            return 'EUR';
        }

        $currency = $product->specs['currency'] ?? null;

        return is_string($currency) && $currency !== '' ? strtoupper($currency) : 'EUR';
    }

    /**
     * @return array{
     *     price: float|null,
     *     priceFormatted: string,
     *     priceOnRequest: bool,
     *     currency: string,
     * }
     */
    private function presentPricing(Product $product, ?ProductVariant $variant): array
    {
        $priceOnRequest = (bool) ($variant?->price_on_request ?? true);
        $context = $this->currencyResolver->resolve();
        $sourceCurrency = $this->sourceCurrency($product);
        $sourceAmount = $variant?->price !== null ? (float) $variant->price : null;
        $displayAmount = $sourceAmount !== null
            ? $this->priceConverter->convert($sourceAmount, $sourceCurrency, $context->currency)
            : null;

        return [
            'price' => $displayAmount,
            'priceFormatted' => StorefrontMoney::format($displayAmount, $priceOnRequest, $context->currency),
            'priceOnRequest' => $priceOnRequest,
            'currency' => $context->currency,
        ];
    }

    /**
     * @return list<array{src: string, alt: string}>
     */
    private function resolveGallery(Product $product, ?ProductVariant $variant = null): array
    {
        if ($variant !== null && $variant->relationLoaded('images') && $variant->images->isNotEmpty()) {
            return $this->mapImages($variant->images, $product->name);
        }

        $shared = $product->images->whereNull('product_variant_id');

        if ($shared->isNotEmpty()) {
            return $this->mapImages($shared, $product->name);
        }

        return $this->mapImages($product->images, $product->name);
    }

    /**
     * @param  Collection<int, ProductImage>|iterable<int, ProductImage>  $images
     * @return list<array{src: string, alt: string}>
     */
    private function mapImages(iterable $images, string $fallbackAlt): array
    {
        return collect($images)
            ->sortBy('sort_order')
            ->map(fn (ProductImage $image): array => [
                'src' => $this->imageUrl->resolve($image),
                'alt' => (string) ($image->alt ?: $fallbackAlt),
            ])
            ->filter(fn (array $image): bool => $image['src'] !== '')
            ->values()
            ->all();
    }
}
