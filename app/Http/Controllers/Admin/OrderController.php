<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Support\AdminPagination;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->withCount('items')
            ->recent()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Order $order): array => $this->serializeSummary($order));

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items' => fn ($query) => $query->orderBy('sort_order')]);

        $activeInvoice = $order->invoices()
            ->whereNot('status', InvoiceStatus::Void)
            ->latest()
            ->first();

        return Inertia::render('admin/orders/show', [
            'order' => $this->serialize($order),
            'invoice' => $activeInvoice ? $this->serializeInvoiceSummary($activeInvoice) : null,
            'canCreateInvoice' => $order->items->isNotEmpty(),
            'statusOptions' => $this->statusOptions(),
            'breadcrumbs' => $this->breadcrumbs($order),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $order->update($request->validated());

        return redirect()
            ->route('admin.orders.show', $order)
            ->with('success', 'Order updated.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeSummary(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'items_count' => $order->items_count,
            'total' => $order->total !== null ? (float) $order->total : null,
            'has_price_on_request_items' => $order->has_price_on_request_items,
            'currency' => $order->currency,
            'placed_at' => $order->placed_at->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'shipping_address' => $order->shipping_address,
            'shipping_city' => $order->shipping_city,
            'shipping_state' => $order->shipping_state,
            'customer_note' => $order->customer_note,
            'admin_note' => $order->admin_note,
            'subtotal' => $order->subtotal !== null ? (float) $order->subtotal : null,
            'shipping_total' => $order->shipping_total !== null ? (float) $order->shipping_total : null,
            'total' => $order->total !== null ? (float) $order->total : null,
            'has_price_on_request_items' => $order->has_price_on_request_items,
            'currency' => $order->currency,
            'placed_at' => $order->placed_at->toIso8601String(),
            'items' => $order->items->map(fn (OrderItem $item): array => $this->serializeItem($item))->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeItem(OrderItem $item): array
    {
        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'product_variant_id' => $item->product_variant_id,
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'sku' => $item->sku,
            'stock_status' => $item->stock_status->value,
            'stock_status_label' => $item->stock_status->label(),
            'unit_price' => $item->unit_price !== null ? (float) $item->unit_price : null,
            'price_on_request' => $item->price_on_request,
            'quantity' => $item->quantity,
            'line_total' => $item->line_total !== null ? (float) $item->line_total : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeInvoiceSummary(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'status' => $invoice->status->value,
            'status_label' => $invoice->status->label(),
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return array_map(
            fn (OrderStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            OrderStatus::cases(),
        );
    }

    /**
     * @return array<int, array{id: string, name: string, href: string}>
     */
    private function breadcrumbs(Order $order): array
    {
        return [
            ['id' => '', 'name' => 'Dashboard', 'href' => route('admin.dashboard')],
            ['id' => 'orders', 'name' => 'Orders', 'href' => route('admin.orders.index')],
            ['id' => $order->id, 'name' => $order->order_number, 'href' => route('admin.orders.show', $order)],
        ];
    }
}
