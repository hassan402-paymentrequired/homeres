<?php

use App\Enums\InvoiceStatus;
use App\Mail\InvoiceMail;
use App\Models\Admin;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreSetting;
use App\Services\InvoiceFromOrderGenerator;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
});

test('guests cannot access invoices admin', function () {
    $this->get(route('admin.invoices.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view invoices index', function () {
    $invoice = Invoice::factory()->sent()->create();
    InvoiceItem::factory()->for($invoice)->count(2)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/index')
            ->has('invoices.data', 1)
            ->where('invoices.data.0.invoice_number', $invoice->invoice_number)
            ->where('invoices.data.0.items_count', 2)
            ->where('invoices.per_page', 15));
});

test('admins can view an invoice', function () {
    $order = Order::factory()->pending()->create();
    $orderItem = OrderItem::factory()->for($order)->create();
    $invoice = Invoice::factory()->forOrder($order)->sent()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.show', $invoice))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/show')
            ->where('invoice.id', $invoice->id)
            ->where('invoice.invoice_number', $invoice->invoice_number)
            ->where('invoice.order_number', $order->order_number)
            ->has('preview')
            ->where('preview.invoice_number', $invoice->invoice_number)
            ->has('statusOptions', 4)
            ->where('canSend', true)
            ->where('canDuplicate', true));
});

test('admins can update invoice status admin note and due date', function () {
    $invoice = Invoice::factory()->sent()->create([
        'admin_note' => null,
        'due_at' => now()->addDays(7),
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.invoices.update', $invoice), [
            'status' => InvoiceStatus::Paid->value,
            'admin_note' => 'Bank transfer received.',
            'due_at' => now()->addDays(14)->toDateString(),
        ])
        ->assertRedirect(route('admin.invoices.show', $invoice));

    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->admin_note)->toBe('Bank transfer received.')
        ->and($invoice->paid_at)->not->toBeNull();
});

test('marking invoice as sent sets issued at when missing', function () {
    $invoice = Invoice::factory()->draft()->create([
        'issued_at' => null,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.invoices.update', $invoice), [
            'status' => InvoiceStatus::Sent->value,
            'admin_note' => null,
            'due_at' => null,
        ])
        ->assertRedirect(route('admin.invoices.show', $invoice));

    expect($invoice->fresh()->issued_at)->not->toBeNull();
});

test('invoice update requires a valid status', function () {
    $invoice = Invoice::factory()->draft()->create();

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.invoices.update', $invoice), [
            'status' => 'invalid',
            'admin_note' => null,
        ])
        ->assertSessionHasErrors('status');
});

test('invoice from order generator copies order snapshot', function () {
    StoreSetting::current()->update(['invoice_due_days' => 10]);

    $order = Order::factory()->pending()->create();
    OrderItem::factory()->for($order)->count(2)->create();

    $invoice = app(InvoiceFromOrderGenerator::class)->create($order, InvoiceStatus::Draft);

    expect($invoice->order_id)->toBe($order->id)
        ->and($invoice->customer_email)->toBe($order->customer_email)
        ->and($invoice->items)->toHaveCount(2)
        ->and($invoice->items->first()->order_item_id)->not->toBeNull()
        ->and((float) $invoice->discount)->toBe(0.0)
        ->and((float) $invoice->tax)->toBe(0.0)
        ->and($invoice->due_at)->not->toBeNull();
});

test('invoices index shows empty state when none exist', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/index')
            ->has('invoices.data', 0));
});

test('admins can create a draft invoice from an order', function () {
    $order = Order::factory()->pending()->create();
    OrderItem::factory()->for($order)->count(2)->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.orders.invoice.store', $order), [
            'send' => '0',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Invoice created.');

    $invoice = $order->fresh()->invoices()->first();

    expect($invoice)->not->toBeNull()
        ->and($invoice->status)->toBe(InvoiceStatus::Draft)
        ->and($invoice->items)->toHaveCount(2)
        ->and($invoice->issued_at)->toBeNull();
});

test('admins can create and send an invoice from an order', function () {
    Mail::fake();

    $order = Order::factory()->pending()->create([
        'customer_email' => 'customer@example.com',
    ]);
    OrderItem::factory()->for($order)->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.orders.invoice.store', $order), [
            'send' => '1',
            'recipient_email' => 'customer@example.com',
            'message' => 'Thank you for shopping with Homère.',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Invoice created and sent to customer@example.com.');

    $invoice = $order->fresh()->invoices()->first();

    expect($invoice->status)->toBe(InvoiceStatus::Sent)
        ->and($invoice->issued_at)->not->toBeNull();

    Mail::assertSent(InvoiceMail::class, function (InvoiceMail $mail) {
        return $mail->hasTo('customer@example.com')
            && $mail->personalMessage === 'Thank you for shopping with Homère.';
    });
});

test('creating an invoice reuses an existing active invoice instead of duplicating', function () {
    $order = Order::factory()->pending()->create();
    OrderItem::factory()->for($order)->create();
    $existing = Invoice::factory()->forOrder($order)->draft()->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.orders.invoice.store', $order), [
            'send' => '0',
        ])
        ->assertRedirect(route('admin.invoices.show', $existing))
        ->assertSessionHas('success', 'An invoice already exists for this order.');

    expect($order->fresh()->invoices()->whereNot('status', InvoiceStatus::Void)->count())->toBe(1);
});

test('cannot create an invoice for an order without line items', function () {
    $order = Order::factory()->pending()->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.orders.invoice.store', $order), [
            'send' => '0',
        ])
        ->assertSessionHasErrors('order');
});

test('admins can send an existing invoice by email', function () {
    Mail::fake();

    $invoice = Invoice::factory()->draft()->create([
        'customer_email' => 'customer@example.com',
    ]);
    InvoiceItem::factory()->for($invoice)->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.invoices.send', $invoice), [
            'recipient_email' => 'billing@example.com',
            'message' => 'Please find your invoice attached below.',
        ])
        ->assertRedirect(route('admin.invoices.show', $invoice))
        ->assertSessionHas('success', 'Invoice sent to billing@example.com.');

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Sent);

    Mail::assertSent(InvoiceMail::class, fn (InvoiceMail $mail) => $mail->hasTo('billing@example.com'));
});

test('void invoices cannot be sent', function () {
    Mail::fake();

    $invoice = Invoice::factory()->create([
        'status' => InvoiceStatus::Void,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.invoices.send', $invoice), [
            'recipient_email' => 'customer@example.com',
        ])
        ->assertSessionHasErrors('invoice');

    Mail::assertNothingSent();
});

test('admins can open invoice compose page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/create')
            ->where('prefill', null)
            ->where('edit_invoice', null)
            ->has('payment_defaults'));
});

test('admins can prefill compose from an order', function () {
    $order = Order::factory()->pending()->create();
    OrderItem::factory()->for($order)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.create', ['order_id' => $order->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/create')
            ->where('prefill.order_id', $order->id)
            ->where('prefill.customer_email', $order->customer_email)
            ->has('prefill.lines', 1));
});

test('admins can store a composed draft invoice', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.invoices.store'), [
            'invoice_number' => 'INV-TEST-0001',
            'customer_name' => 'Ada Lovelace',
            'customer_email' => 'ada@example.com',
            'intent' => 'draft',
            'order_id' => null,
            'discount' => 1000,
            'tax' => 500,
            'items' => [
                [
                    'description' => 'Velvet sofa',
                    'quantity' => 1,
                    'unit_price' => 2500000,
                ],
            ],
        ])
        ->assertRedirect();

    $invoice = Invoice::query()->where('invoice_number', 'INV-TEST-0001')->first();

    expect($invoice)->not->toBeNull()
        ->and($invoice->status)->toBe(InvoiceStatus::Draft)
        ->and((float) $invoice->discount)->toBe(1000.0)
        ->and((float) $invoice->tax)->toBe(500.0)
        ->and($invoice->items)->toHaveCount(1);
});

test('admins can edit a draft invoice compose page', function () {
    $invoice = Invoice::factory()->draft()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.edit', $invoice))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/invoices/create')
            ->where('edit_invoice.id', $invoice->id));
});

test('non-draft invoices cannot be edited via compose', function () {
    $invoice = Invoice::factory()->sent()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.edit', $invoice))
        ->assertForbidden();
});

test('invoice show includes send capability unless void', function () {
    $invoice = Invoice::factory()->draft()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.show', $invoice))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('canSend', true));

    $invoice->update(['status' => InvoiceStatus::Void]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.invoices.show', $invoice))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('canSend', false));
});
