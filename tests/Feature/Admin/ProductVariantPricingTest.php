<?php

use App\Enums\StockStatus;
use App\Models\Admin;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
    $this->category = Category::factory()->create();
});

test('admins can save a list price on out of stock variants', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'sold-out-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.variants.store', $product), [
            'name' => 'Default',
            'stock_status' => StockStatus::OutOfStock->value,
            'price' => '1250000',
            'price_on_request' => '0',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.show', $product));

    $variant = ProductVariant::query()->where('product_id', $product->id)->first();

    expect($variant)->not->toBeNull()
        ->and($variant->stock_status)->toBe(StockStatus::OutOfStock)
        ->and((float) $variant->price)->toBe(1250000.0)
        ->and($variant->price_on_request)->toBeFalse();
});

test('admins can save a reference price when price on request is enabled', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'reference-price-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.variants.store', $product), [
            'name' => 'Default',
            'stock_status' => StockStatus::InStockRemote->value,
            'lead_time_days_air' => '7',
            'lead_time_days_sea' => '45',
            'price' => '890000',
            'price_on_request' => '1',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.show', $product));

    $variant = ProductVariant::query()->where('product_id', $product->id)->first();

    expect($variant)->not->toBeNull()
        ->and($variant->price_on_request)->toBeTrue()
        ->and((float) $variant->price)->toBe(890000.0);
});
