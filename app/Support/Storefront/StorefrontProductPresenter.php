<?php

namespace App\Support\Storefront;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;

final class StorefrontProductPresenter
{
    public function __construct(
        private ProductImageUrl $imageUrl,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function card(Product $product): array
    {
        $product->loadMissing(['brand', 'category', 'images', 'variants']);

        $variant = $this->defaultVariant($product);

        return [
            'id' => $product->id,
            'handle' => $product->handle,
            'name' => $product->name,
            'brand' => $product->brand?->name ?? '',
            'brandHandle' => $product->brand?->handle ?? '',
            'price' => $variant?->price !== null ? (float) $variant->price : null,
            'priceFormatted' => StorefrontMoney::format(
                $variant?->price !== null ? (float) $variant->price : null,
                (bool) ($variant?->price_on_request ?? true),
            ),
            'priceOnRequest' => (bool) ($variant?->price_on_request ?? true),
            'category' => $product->category?->name ?? '',
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

        $variant = $this->defaultVariant($product);
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
        return [
            'id' => $variant->id,
            'name' => $variant->name,
            'sku' => $variant->sku,
            'price' => $variant->price !== null ? (float) $variant->price : null,
            'priceFormatted' => StorefrontMoney::format(
                $variant->price !== null ? (float) $variant->price : null,
                (bool) $variant->price_on_request,
            ),
            'priceOnRequest' => (bool) $variant->price_on_request,
            'stockStatus' => $variant->stock_status->value,
            'stockStatusLabel' => $variant->stock_status->label(),
            'leadTimeDaysAir' => $variant->lead_time_days_air,
            'leadTimeDaysSea' => $variant->lead_time_days_sea,
            'optionValues' => $variant->option_values ?? [],
        ];
    }

    private function defaultVariant(Product $product): ?ProductVariant
    {
        return $product->variants->firstWhere('is_active', true)
            ?? $product->variants->first();
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
            ->except(['dimensions', 'material'])
            ->filter(fn ($value): bool => filled($value))
            ->map(fn ($value, string $key): string => str($key)->replace('_', ' ')->title()->toString().': '.$value)
            ->values()
            ->all();
    }
}
