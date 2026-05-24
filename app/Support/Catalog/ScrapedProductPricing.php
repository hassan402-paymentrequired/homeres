<?php

namespace App\Support\Catalog;

final class ScrapedProductPricing
{
    /**
     * @param  array<string, mixed>  $entry
     */
    public function resolveVariantPrice(array $entry, array $variant, int $variantCount): ?float
    {
        $price = $this->parse($variant['price'] ?? null);

        if ($price !== null) {
            return $price;
        }

        if ($variantCount === 1) {
            return $this->parse($entry['price_min'] ?? null)
                ?? $this->parse($entry['price_max'] ?? null);
        }

        return null;
    }

    public function parse(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            $amount = (float) $value;

            return $amount > 0 ? $amount : null;
        }

        $normalized = preg_replace('/[^\d.,]/', '', (string) $value);

        if ($normalized === null || $normalized === '') {
            return null;
        }

        if (str_contains($normalized, ',') && str_contains($normalized, '.')) {
            $normalized = str_replace(',', '', $normalized);
        } elseif (str_contains($normalized, ',') && ! str_contains($normalized, '.')) {
            $normalized = str_replace(',', '.', $normalized);
        }

        $amount = (float) $normalized;

        return $amount > 0 ? $amount : null;
    }
}
