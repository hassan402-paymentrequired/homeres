<?php

namespace App\Support\Storefront;

final class StorefrontPriceConverter
{
    public function convert(?float $amount, string $fromCurrency, string $toCurrency): ?float
    {
        if ($amount === null || $amount <= 0) {
            return null;
        }

        $from = strtoupper($fromCurrency);
        $to = strtoupper($toCurrency);

        if ($from === $to) {
            return round($amount, 2);
        }

        /** @var array<string, array<string, float>> $rates */
        $rates = config('storefront.exchange_rates', []);

        $factor = $rates[$from][$to] ?? null;

        if ($factor === null) {
            return round($amount, 2);
        }

        return round($amount * $factor, 2);
    }
}
