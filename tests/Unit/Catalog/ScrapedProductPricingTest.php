<?php

use App\Support\Catalog\ScrapedProductPricing;

test('parses string and numeric scraped prices', function () {
    $pricing = new ScrapedProductPricing;

    expect($pricing->parse('1495.00'))->toBe(1495.0)
        ->and($pricing->parse(1195))->toBe(1195.0)
        ->and($pricing->parse('0.00'))->toBeNull()
        ->and($pricing->parse(''))->toBeNull();
});

test('falls back to product price_min when a single variant price is zero', function () {
    $pricing = new ScrapedProductPricing;

    $entry = [
        'price_min' => 1495,
        'price_max' => 1495,
        'variants' => [
            ['price' => '0.00', 'available' => true],
        ],
    ];

    expect($pricing->resolveVariantPrice($entry, $entry['variants'][0], 1))->toBe(1495.0);
});

test('uses the lowest positive variant price for multi variant products', function () {
    $pricing = new ScrapedProductPricing;

    $entry = [
        'price_min' => 599,
        'variants' => [
            ['price' => '599.00'],
            ['price' => '720.00'],
        ],
    ];

    expect($pricing->resolveVariantPrice($entry, $entry['variants'][0], 2))->toBe(599.0);
});
