<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\StockStatus;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private OrderNumberGenerator $orderNumberGenerator,
        private OrderNotificationSender $orderNotificationSender,
    ) {}

    /**
     * @param  array{
     *     customer_name: string,
     *     customer_email: string,
     *     customer_phone?: string|null,
     *     shipping_address: string,
     *     shipping_city: string,
     *     shipping_state?: string|null,
     *     customer_note?: string|null,
     *     items: array<int, array{variant_id: string, quantity: int}>,
     *     user_id?: string|null
     * }  $data
     */
    public function place(array $data): Order
    {
        $order = DB::transaction(function () use ($data): Order {
            $lines = $this->resolveLines($data['items']);
            $hasPriceOnRequest = $lines->contains(fn (array $line): bool => $line['price_on_request']);
            $subtotal = $hasPriceOnRequest
                ? null
                : round($lines->sum(fn (array $line): float => (float) $line['line_total']), 2);
            $shippingTotal = $subtotal !== null ? 0.0 : null;
            $total = $subtotal !== null ? $subtotal + $shippingTotal : null;

            $order = Order::query()->create([
                'user_id' => $data['user_id'] ?? null,
                'order_number' => $this->orderNumberGenerator->generate(),
                'status' => OrderStatus::Pending,
                'payment_status' => $this->paymentStatusForTotal($total, $hasPriceOnRequest),
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'],
                'shipping_state' => $data['shipping_state'] ?? null,
                'customer_note' => $data['customer_note'] ?? null,
                'subtotal' => $subtotal,
                'shipping_total' => $shippingTotal,
                'total' => $total,
                'has_price_on_request_items' => $hasPriceOnRequest,
                'currency' => 'NGN',
                'placed_at' => now(),
            ]);

            foreach ($lines as $index => $line) {
                $order->items()->create([
                    'product_id' => $line['product_id'],
                    'product_variant_id' => $line['variant_id'],
                    'product_name' => $line['product_name'],
                    'variant_name' => $line['variant_name'],
                    'sku' => $line['sku'],
                    'stock_status' => $line['stock_status'],
                    'unit_price' => $line['unit_price'],
                    'price_on_request' => $line['price_on_request'],
                    'quantity' => $line['quantity'],
                    'line_total' => $line['line_total'],
                    'sort_order' => $index + 1,
                ]);
            }

            return $order->fresh(['items']);
        });

        $this->orderNotificationSender->send($order);

        return $order;
    }

    public function markPaid(Order $order, string $reference, ?string $transactionId = null): void
    {
        $order->update([
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Confirmed,
            'paystack_reference' => $reference,
            'paystack_transaction_id' => $transactionId,
        ]);
    }

    /**
     * @param  array<int, array{variant_id: string, quantity: int}>  $items
     * @return Collection<int, array{
     *     variant_id: string,
     *     product_id: string,
     *     product_name: string,
     *     variant_name: string,
     *     sku: string|null,
     *     stock_status: StockStatus,
     *     unit_price: float|null,
     *     price_on_request: bool,
     *     quantity: int,
     *     line_total: float|null
     * }>
     */
    private function resolveLines(array $items): Collection
    {
        if ($items === []) {
            throw ValidationException::withMessages([
                'items' => 'Your bag is empty.',
            ]);
        }

        return collect($items)->map(function (array $item): array {
            $variant = ProductVariant::query()
                ->with(['product' => fn ($query) => $query->published()])
                ->where('id', $item['variant_id'])
                ->where('is_active', true)
                ->first();

            if ($variant === null || $variant->product === null) {
                throw ValidationException::withMessages([
                    'items' => 'One or more items are no longer available.',
                ]);
            }

            $quantity = max(1, (int) $item['quantity']);
            $priceOnRequest = (bool) $variant->price_on_request || $variant->price === null || (float) $variant->price <= 0;
            $unitPrice = $priceOnRequest ? null : (float) $variant->price;
            $lineTotal = $unitPrice !== null ? round($unitPrice * $quantity, 2) : null;

            return [
                'variant_id' => $variant->id,
                'product_id' => $variant->product_id,
                'product_name' => $variant->product->name,
                'variant_name' => $variant->name,
                'sku' => $variant->sku,
                'stock_status' => $variant->stock_status,
                'unit_price' => $unitPrice,
                'price_on_request' => $priceOnRequest,
                'quantity' => $quantity,
                'line_total' => $lineTotal,
            ];
        });
    }

    private function paymentStatusForTotal(?float $total, bool $hasPriceOnRequest): PaymentStatus
    {
        if ($hasPriceOnRequest || $total === null || $total <= 0) {
            return PaymentStatus::NotRequired;
        }

        return PaymentStatus::Pending;
    }
}
