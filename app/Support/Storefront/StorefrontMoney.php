<?php

namespace App\Support\Storefront;

final class StorefrontMoney
{
    public static function format(?float $amount, bool $priceOnRequest = false): string
    {
        if ($priceOnRequest || $amount === null || $amount <= 0) {
            return 'Price on request';
        }

        return '₦'.number_format($amount, 2, '.', ',');
    }
}
