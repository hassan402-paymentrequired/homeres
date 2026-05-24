<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('product card image uses storage url when url is empty', function () {
    Storage::fake('public');
    Storage::disk('public')->put('catalog/sofa.jpg', 'image');

    $category = Category::factory()->create(['handle' => 'sofas']);
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    ProductVariant::factory()->create(['product_id' => $product->id, 'is_active' => true]);
    ProductImage::factory()->create([
        'product_id' => $product->id,
        'url' => null,
        'path' => 'catalog/sofa.jpg',
        'alt' => 'Sofa',
    ]);

    $this->get(route('shop'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.images.0.src', Storage::disk('public')->url('catalog/sofa.jpg')));
});

test('shop sort query is applied server side', function () {
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();

    $alpha = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'name' => 'Alpha Chair',
    ]);
    $beta = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'name' => 'Beta Table',
    ]);

    ProductVariant::factory()->create(['product_id' => $alpha->id, 'is_active' => true]);
    ProductVariant::factory()->create(['product_id' => $beta->id, 'is_active' => true]);

    $this->get(route('shop', ['sort' => 'name']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('products.data.0.name', 'Alpha Chair')
            ->where('products.data.1.name', 'Beta Table')
            ->where('catalog.filters.sort', 'name'));
});
