<?php

use App\Enums\OrderStatus;
use App\Models\Admin;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
});

test('guests cannot access orders admin', function () {
    $this->get(route('admin.orders.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view orders index', function () {
    $order = Order::factory()->pending()->create();
    OrderItem::factory()->for($order)->count(2)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', $order->order_number)
            ->where('orders.data.0.items_count', 2)
            ->where('orders.per_page', 15));
});

test('admins can view an order', function () {
    $variant = ProductVariant::factory()->inStore()->create();
    $order = Order::factory()->pending()->create();
    $item = OrderItem::factory()->for($order)->forVariant($variant, 2)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/show')
            ->where('order.id', $order->id)
            ->where('order.order_number', $order->order_number)
            ->where('order.customer_email', $order->customer_email)
            ->where('canCreateInvoice', true)
            ->where('invoice', null)
            ->has('order.items', 1)
            ->where('order.items.0.product_name', $item->product_name)
            ->where('order.items.0.quantity', 2)
            ->has('statusOptions', 5));
});

test('admins can update order status and admin note', function () {
    $order = Order::factory()->pending()->create([
        'admin_note' => null,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.orders.update', $order), [
            'status' => OrderStatus::Processing->value,
            'admin_note' => 'Supplier confirmed air freight.',
        ])
        ->assertRedirect(route('admin.orders.show', $order));

    $order->refresh();

    expect($order->status)->toBe(OrderStatus::Processing)
        ->and($order->admin_note)->toBe('Supplier confirmed air freight.');
});

test('order update requires a valid status', function () {
    $order = Order::factory()->pending()->create();

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.orders.update', $order), [
            'status' => 'invalid',
            'admin_note' => null,
        ])
        ->assertSessionHasErrors('status');
});

test('orders index shows empty state when none exist', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 0));
});
