<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('checkout creates an order from cart payload', function () {
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 250000,
        'price_on_request' => false,
        'is_active' => true,
    ]);

    $this->post(route('checkout.store'), [
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
        'customer_phone' => '+2348000000000',
        'shipping_address' => '12 Marina',
        'shipping_city' => 'Lagos',
        'shipping_state' => 'Lagos',
        'customer_note' => 'Please call on arrival.',
        'items' => [
            ['variant_id' => $variant->id, 'quantity' => 2],
        ],
    ])->assertRedirect();

    $order = Order::query()->first();

    expect($order)->not->toBeNull()
        ->and($order->customer_name)->toBe('Ada Lovelace')
        ->and($order->status)->toBe(OrderStatus::Pending)
        ->and($order->payment_status)->toBe(PaymentStatus::Pending)
        ->and((float) $order->total)->toBe(500000.0)
        ->and($order->items)->toHaveCount(1);
});

test('shop page paginates published products from database', function () {
    $category = Category::factory()->create(['handle' => 'sofas']);
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'name' => 'Test Sofa',
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => false,
        'name' => 'Draft Sofa',
    ]);

    $this->get(route('shop.category', 'sofas'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('catalog/index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Test Sofa')
            ->where('products.total', 1)
            ->where('catalog.view', 'category')
            ->where('catalog.filters.category', 'sofas'));
});

test('shop all page uses pagination and does not load entire catalog', function () {
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();

    Product::factory()
        ->count(30)
        ->create([
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'is_active' => true,
        ])
        ->each(fn (Product $product) => ProductVariant::factory()->create([
            'product_id' => $product->id,
            'is_active' => true,
        ]));

    $this->get(route('shop'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('catalog/index')
            ->where('products.total', 30)
            ->where('products.per_page', 24)
            ->has('products.data', 24)
            ->where('catalog.view', 'shop'));
});

test('product page resolves product by handle', function () {
    $category = Category::factory()->create(['handle' => 'lamps']);
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'handle' => 'arc-floor-lamp',
        'is_active' => true,
    ]);
    ProductVariant::factory()->create(['product_id' => $product->id, 'is_active' => true]);

    $this->get(route('products.show', 'arc-floor-lamp'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('product/show')
            ->where('product.handle', 'arc-floor-lamp'));
});
