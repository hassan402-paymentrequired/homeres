<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default country when geo headers are unavailable (local dev, etc.)
    |--------------------------------------------------------------------------
    */
    'default_country' => env('STOREFRONT_DEFAULT_COUNTRY', 'NG'),

    /*
    |--------------------------------------------------------------------------
    | Exchange rates from catalog source currency (scraped JSON is EUR)
    |--------------------------------------------------------------------------
    |
    | Multiply the stored variant price by these factors when displaying prices.
    | Update periodically or wire to a rates API later.
    |
    */
    'exchange_rates' => [
        'EUR' => [
            'NGN' => (float) env('STOREFRONT_EUR_TO_NGN', 1700),
            'USD' => (float) env('STOREFRONT_EUR_TO_USD', 1.09),
        ],
        'NGN' => [
            'USD' => (float) env('STOREFRONT_NGN_TO_USD', 0.00065),
        ],
        'USD' => [
            'NGN' => (float) env('STOREFRONT_USD_TO_NGN', 1550),
        ],
    ],

];
