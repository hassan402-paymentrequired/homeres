<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Support\Storefront\StorefrontCurrencyResolver;
use App\Support\Storefront\StorefrontPriceConverter;
use App\Support\Storefront\StorefrontProductPresenter;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('buyers in nigeria see prices in naira', function () {
    config(['storefront.exchange_rates.EUR.NGN' => 1000]);

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'specs' => ['currency' => 'EUR'],
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 100,
        'price_on_request' => false,
        'is_active' => true,
    ]);

    $this->withHeader('CF-IPCountry', 'NG')
        ->get(route('shop'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('storefrontCurrency.currency', 'NGN')
            ->where('storefrontCurrency.is_nigeria', true)
            ->where('products.data.0.priceFormatted', '₦100,000.00')
            ->where('products.data.0.currency', 'NGN'));
});

test('buyers outside nigeria see prices in us dollars', function () {
    config(['storefront.exchange_rates.EUR.USD' => 2]);

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'specs' => ['currency' => 'EUR'],
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 50,
        'price_on_request' => false,
        'is_active' => true,
    ]);

    $this->withHeader('CF-IPCountry', 'US')
        ->get(route('shop'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('storefrontCurrency.currency', 'USD')
            ->where('storefrontCurrency.is_nigeria', false)
            ->where('products.data.0.priceFormatted', '$100.00')
            ->where('products.data.0.currency', 'USD'));
});

test('buyers can override detected currency in session', function () {
    $this->withHeader('CF-IPCountry', 'US')
        ->post(route('storefront.currency'), ['currency' => 'NGN'])
        ->assertRedirect();

    expect(app(StorefrontCurrencyResolver::class)->resolve()->currency)->toBe('NGN');
});

test('price converter uses configured exchange rates', function () {
    config(['storefront.exchange_rates.EUR.USD' => 1.5]);

    $converted = app(StorefrontPriceConverter::class)->convert(100, 'EUR', 'USD');

    expect($converted)->toBe(150.0);
});

test('presenter converts catalog source currency to resolved display currency', function () {
    config(['storefront.exchange_rates.EUR.NGN' => 10]);

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'specs' => ['currency' => 'EUR'],
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 1495,
        'price_on_request' => false,
        'is_active' => true,
    ]);

    $this->withHeader('CF-IPCountry', 'NG')->get(route('shop'));

    $card = app(StorefrontProductPresenter::class)->card($product->fresh(['brand', 'category', 'variants']));

    expect($card['currency'])->toBe('NGN')
        ->and($card['price'])->toBe(14950.0)
        ->and($card['priceFormatted'])->toBe('₦14,950.00');
});
