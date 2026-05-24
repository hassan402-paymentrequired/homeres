<?php

namespace App\Support\Storefront;

final class StorefrontMoney
{
    /**
     * @var array<string, string>
     */
    private const SYMBOLS = [
        'EUR' => '€',
        'NGN' => '₦',
        'USD' => '$',
        'GBP' => '£',
    ];

    public static function format(?float $amount, bool $priceOnRequest = false, string $currency = 'NGN'): string
    {
        if ($priceOnRequest || $amount === null || $amount <= 0) {
            return 'Price on request';
        }

        $code = strtoupper($currency);
        $symbol = self::SYMBOLS[$code] ?? $code.' ';

        return $symbol.number_format($amount, 2, '.', ',');
    }
}
