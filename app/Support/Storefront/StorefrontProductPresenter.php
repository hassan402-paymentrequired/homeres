<?php

namespace App\Support\Storefront;

use App\Models\Product;
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
        $product->loadMissing(['brand', 'category', 'images', 'variants']);

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
            'images' => $this->images($product),
            'isNew' => $product->created_at?->greaterThan(now()->subDays(60)) ?? false,
            'defaultVariantId' => $variant?->id,
            'href' => route('products.show', $product),
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
        $product->loadMissing(['brand', 'category', 'images', 'variants']);

        $variant = $this->displayVariant($product);
        $card = $this->card($product);

        return [
            ...$card,
            'details' => $this->detailsFromSpecs($product),
            'variants' => $product->variants
                ->where('is_active', true)
                ->values()
                ->map(fn (ProductVariant $item): array => $this->variant($item))
                ->all(),
            'sku' => $variant?->sku,
            'dimensions' => is_array($product->specs) ? ($product->specs['dimensions'] ?? null) : null,
            'material' => is_array($product->specs) ? ($product->specs['material'] ?? null) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function variant(ProductVariant $variant): array
    {
        $variant->loadMissing('product');
        $pricing = $this->presentPricing($variant->product, $variant);

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
        ];
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
    private function images(Product $product): array
    {
        return $product->images
            ->map(fn ($image): array => [
                'src' => $this->imageUrl->resolve($image),
                'alt' => (string) ($image->alt ?: $product->name),
            ])
            ->filter(fn (array $image): bool => $image['src'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function detailsFromSpecs(Product $product): array
    {
        if (! is_array($product->specs)) {
            return [];
        }

        return collect($product->specs)
            ->except(['dimensions', 'material', 'currency'])
            ->filter(fn ($value): bool => filled($value))
            ->map(fn ($value, string $key): string => str($key)->replace('_', ' ')->title()->toString().': '.$value)
            ->values()
            ->all();
    }
}
