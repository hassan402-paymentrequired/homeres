<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function checkoutPayload(ProductVariant $variant): array
{
    return [
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
    ];
}

function createCheckoutVariant(): ProductVariant
{
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);

    return ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 250000,
        'price_on_request' => false,
        'is_active' => true,
    ]);
}

test('checkout links order to authenticated user', function () {
    $user = User::factory()->create();
    $variant = createCheckoutVariant();

    $this->actingAs($user)
        ->post(route('checkout.store'), checkoutPayload($variant))
        ->assertRedirect();

    $order = Order::query()->first();

    expect($order)->not->toBeNull()
        ->and($order->user_id)->toBe($user->id);
});

test('guest checkout leaves order unlinked', function () {
    $variant = createCheckoutVariant();

    $this->post(route('checkout.store'), checkoutPayload($variant))
        ->assertRedirect();

    expect(Order::query()->first()->user_id)->toBeNull();
});

test('authenticated user can view their order history', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $userOrder = Order::factory()->create([
        'user_id' => $user->id,
        'customer_email' => $user->email,
    ]);

    Order::factory()->create([
        'user_id' => $otherUser->id,
        'customer_email' => $otherUser->email,
    ]);

    $this->actingAs($user)
        ->get(route('account.orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('account/orders/index')
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $userOrder->id));
});

test('authenticated user cannot view another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $otherOrder = Order::factory()->create([
        'user_id' => $otherUser->id,
        'customer_email' => $otherUser->email,
    ]);

    $this->actingAs($user)
        ->get(route('account.orders.show', $otherOrder))
        ->assertForbidden();
});

test('guest cannot access order history', function () {
    $this->get(route('account.orders.index'))->assertRedirect(route('login'));
});
