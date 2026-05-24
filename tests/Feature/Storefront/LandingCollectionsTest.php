<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Support\Storefront\LandingCollectionsBuilder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('landing collections only include categories with published products', function () {
    $withProducts = Category::factory()->create([
        'handle' => 'decor-accessories',
        'name' => 'Decor & Accessories',
        'is_active' => true,
    ]);
    $empty = Category::factory()->create([
        'handle' => 'furniture',
        'name' => 'Furniture',
        'is_active' => true,
    ]);

    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $withProducts->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    $collections = app(LandingCollectionsBuilder::class)->build();

    expect($collections)->toHaveCount(1)
        ->and($collections[0]['slug'])->toBe('decor-accessories')
        ->and($collections[0]['name'])->toBe('Home Decor')
        ->and($collections[0]['productCount'])->toBe(1);
});

test('home page passes shop collections from the database', function () {
    $category = Category::factory()->create([
        'handle' => 'lighting',
        'is_active' => true,
    ]);
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('shopCollections', 1)
            ->where('shopCollections.0.slug', 'lighting'));
});
