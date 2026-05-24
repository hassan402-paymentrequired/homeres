<?php

use App\Enums\InvoiceStatus;
use App\Enums\OrderStatus;
use App\Models\Admin;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('dashboard exposes catalog and commerce stats', function () {
    Order::factory()->create([
        'status' => OrderStatus::Pending,
        'total' => 50000,
    ]);
    Order::factory()->create([
        'status' => OrderStatus::Cancelled,
        'total' => 99999,
    ]);
    Invoice::factory()->paid()->create(['total' => 25000]);
    Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'total' => 10000,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->where('stats.orders_count', 2)
            ->where('stats.orders_pending_count', 1)
            ->where('stats.invoices_count', 2)
            ->where('stats.invoices_paid_count', 1)
            ->where('stats.orders_revenue_total', 50000)
            ->where('stats.invoices_collected_total', 25000)
            ->where('stats.invoices_outstanding_total', 10000)
            ->has('recent_orders', 2)
            ->has('recent_invoices', 2)
            ->has('orders_by_status', 5)
            ->has('invoices_by_status', 4));
});

test('analytics page exposes monthly breakdown and stats', function () {
    Order::factory()->create([
        'placed_at' => now()->startOfMonth(),
        'status' => OrderStatus::Confirmed,
        'total' => 120000,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.analytics.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->has('monthly_order_totals', 6)
            ->has('orders_by_status', 5)
            ->has('invoices_by_status', 4));
});

test('guests cannot access analytics', function () {
    $this->get(route('admin.analytics.index'))
        ->assertRedirect(route('admin.login'));
});
