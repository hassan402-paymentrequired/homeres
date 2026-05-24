<?php

namespace App\Services;

use App\Models\Product;

class ProductVariantNaming
{
    /**
     * @param  array<string, string|null>  $optionValues
     * @param  array<int, array<string, mixed>>  $variantOptions
     */
    public function build(array $optionValues, array $variantOptions): string
    {
        $parts = collect($variantOptions)
            ->sortBy('position')
            ->map(function (array $option) use ($optionValues): ?string {
                $key = (string) ($option['key'] ?? '');
                $value = trim((string) ($optionValues[$key] ?? ''));

                if ($value === '') {
                    return null;
                }

                if (($option['type'] ?? '') === 'boolean') {
                    return in_array(strtolower($value), ['1', 'yes'], true)
                        ? (string) ($option['label'] ?? $key)
                        : null;
                }

                return $value;
            })
            ->filter()
            ->values();

        if ($parts->isEmpty()) {
            return 'Default';
        }

        return $parts->implode(' / ');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function variantOptionsFor(Product $product): array
    {
        $product->loadMissing('category.productTemplate');

        return $product->category?->productTemplate?->variant_options ?? [];
    }

    /**
     * @param  array<string, mixed>|null  $optionValues
     * @return array<string, string>
     */
    public function normalizeOptionValues(?array $optionValues, array $variantOptions): array
    {
        $normalized = [];

        foreach ($variantOptions as $option) {
            $key = (string) ($option['key'] ?? '');

            if ($key === '') {
                continue;
            }

            $value = $optionValues[$key] ?? null;

            if (($option['type'] ?? '') === 'boolean') {
                $normalized[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '';

                continue;
            }

            $normalized[$key] = trim((string) ($value ?? ''));
        }

        return $normalized;
    }
}
