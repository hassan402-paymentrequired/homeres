<?php

use App\Models\ProductImage;
use App\Support\Storefront\ProductImageUrl;

test('product image url resolves local storage paths as site relative urls', function () {
    $image = new ProductImage([
        'path' => 'catalog/sofa.jpg',
        'url' => null,
    ]);

    expect(app(ProductImageUrl::class)->resolve($image))->toBe('/storage/catalog/sofa.jpg');
});

test('product image url normalizes absolute storage urls to relative paths', function () {
    $image = new ProductImage([
        'path' => null,
        'url' => 'http://wrong-host.test/storage/products/lamp.jpg',
    ]);

    expect(app(ProductImageUrl::class)->resolve($image))->toBe('/storage/products/lamp.jpg');
});

test('product image url keeps external cdn urls unchanged', function () {
    $image = new ProductImage([
        'path' => null,
        'url' => 'https://cdn.example.com/product.jpg',
    ]);

    expect(app(ProductImageUrl::class)->resolve($image))
        ->toBe('https://cdn.example.com/product.jpg');
});
