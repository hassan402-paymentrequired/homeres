<?php

namespace App\Support;

use App\Models\Order;
use App\Models\OrderItem;

final class OrderMailPresenter
{
    public static function format(?float $amount, bool $priceOnRequest = false): string
    {
        return InvoiceMoney::format($amount, $priceOnRequest);
    }

    /**
     * @return array<string, mixed>
     */
    public static function present(Order $order): array
    {
        $order->loadMissing('items');

        $hasPriceOnRequest = $order->has_price_on_request_items;

        return [
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'shipping_address' => $order->shipping_address,
            'shipping_city' => $order->shipping_city,
            'shipping_state' => $order->shipping_state,
            'customer_note' => $order->customer_note,
            'status_label' => $order->status->label(),
            'payment_status_label' => $order->payment_status->label(),
            'placed_at' => $order->placed_at->timezone(config('app.timezone'))->format('j M Y, g:i A'),
            'subtotal_display' => self::format(
                $order->subtotal !== null ? (float) $order->subtotal : null,
                $hasPriceOnRequest,
            ),
            'shipping_display' => self::format(
                $order->shipping_total !== null ? (float) $order->shipping_total : null,
            ),
            'total_display' => self::format(
                $order->total !== null ? (float) $order->total : null,
                $hasPriceOnRequest,
            ),
            'has_price_on_request_items' => $hasPriceOnRequest,
            'lines' => $order->items
                ->map(fn (OrderItem $item): array => self::presentLine($item))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function presentLine(OrderItem $item): array
    {
        return [
            'description' => trim($item->product_name.' — '.$item->variant_name),
            'quantity' => $item->quantity,
            'unit_price_display' => self::format(
                $item->unit_price !== null ? (float) $item->unit_price : null,
                $item->price_on_request,
            ),
            'line_total_display' => self::format(
                $item->line_total !== null ? (float) $item->line_total : null,
                $item->price_on_request,
            ),
        ];
    }
}
