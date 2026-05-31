<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->withCount('items')
            ->recent()
            ->paginate(10)
            ->through(fn (Order $order): array => $this->serializeSummary($order));

        return Inertia::render('account/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load(['items' => fn ($query) => $query->orderBy('sort_order')]);

        return Inertia::render('account/orders/show', [
            'order' => $this->serialize($order),
        ]);
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
            'payment_status' => $order->payment_status->value,
            'payment_status_label' => $order->payment_status->label(),
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
            'payment_status' => $order->payment_status->value,
            'payment_status_label' => $order->payment_status->label(),
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'shipping_address' => $order->shipping_address,
            'shipping_city' => $order->shipping_city,
            'shipping_state' => $order->shipping_state,
            'customer_note' => $order->customer_note,
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
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'sku' => $item->sku,
            'unit_price' => $item->unit_price !== null ? (float) $item->unit_price : null,
            'price_on_request' => $item->price_on_request,
            'quantity' => $item->quantity,
            'line_total' => $item->line_total !== null ? (float) $item->line_total : null,
        ];
    }
}
