<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Order;
use App\Services\InvoiceNumberGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 150000, 8500000);
        $shippingTotal = fake()->randomElement([0, 0, 25000, 45000]);
        $issuedAt = fake()->dateTimeBetween('-30 days', 'now');

        return [
            'invoice_number' => app(InvoiceNumberGenerator::class)->generate(
                Carbon::instance($issuedAt),
            ),
            'order_id' => null,
            'status' => fake()->randomElement(InvoiceStatus::cases()),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->optional()->numerify('+23480########'),
            'billing_address' => fake()->streetAddress(),
            'billing_city' => fake()->randomElement(['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']),
            'billing_state' => fake()->randomElement(['Lagos', 'FCT', 'Rivers', 'Oyo']),
            'customer_note' => fake()->optional()->sentence(),
            'admin_note' => null,
            'subtotal' => $subtotal,
            'discount' => 0,
            'tax' => 0,
            'shipping_total' => $shippingTotal,
            'total' => $subtotal + $shippingTotal,
            'has_price_on_request_items' => false,
            'currency' => 'NGN',
            'issued_at' => $issuedAt,
            'due_at' => Carbon::instance($issuedAt)->addDays(14),
            'paid_at' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => InvoiceStatus::Draft,
            'issued_at' => null,
            'due_at' => null,
            'paid_at' => null,
        ]);
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => InvoiceStatus::Sent,
            'paid_at' => null,
        ]);
    }

    public function paid(): static
    {
        return $this->state(function (array $attributes) {
            $issuedAt = $attributes['issued_at'] ?? now();

            return [
                'status' => InvoiceStatus::Paid,
                'issued_at' => $issuedAt,
                'paid_at' => $issuedAt,
            ];
        });
    }

    public function forOrder(Order $order): static
    {
        return $this->state(fn (array $attributes) => [
            'order_id' => $order->id,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'billing_address' => $order->shipping_address,
            'billing_city' => $order->shipping_city,
            'billing_state' => $order->shipping_state,
            'customer_note' => $order->customer_note,
            'subtotal' => $order->subtotal,
            'shipping_total' => $order->shipping_total,
            'total' => $order->total,
            'has_price_on_request_items' => $order->has_price_on_request_items,
            'currency' => $order->currency,
        ])->afterCreating(function (Invoice $invoice) use ($order): void {
            if ($invoice->items()->exists()) {
                return;
            }

            $order->loadMissing('items');

            foreach ($order->items as $index => $item) {
                $invoice->items()->create([
                    'order_item_id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'sku' => $item->sku,
                    'unit_price' => $item->unit_price,
                    'price_on_request' => $item->price_on_request,
                    'quantity' => $item->quantity,
                    'line_total' => $item->line_total,
                    'sort_order' => $index + 1,
                ]);
            }
        });
    }
}
