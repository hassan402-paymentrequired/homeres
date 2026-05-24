<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 3);
        $unitPrice = fake()->randomFloat(2, 50000, 2500000);
        $lineTotal = bcmul((string) $unitPrice, (string) $quantity, 2);

        return [
            'invoice_id' => Invoice::factory(),
            'order_item_id' => null,
            'product_name' => fake()->words(3, true),
            'variant_name' => 'Default',
            'sku' => fake()->optional()->bothify('SKU-####'),
            'unit_price' => $unitPrice,
            'price_on_request' => false,
            'quantity' => $quantity,
            'line_total' => $lineTotal,
            'sort_order' => 1,
        ];
    }

    public function priceOnRequest(): static
    {
        return $this->state(fn (array $attributes) => [
            'unit_price' => null,
            'line_total' => null,
            'price_on_request' => true,
        ]);
    }

    public function forOrderItem(OrderItem $item, int $sortOrder = 1): static
    {
        return $this->state(fn (array $attributes) => [
            'order_item_id' => $item->id,
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'sku' => $item->sku,
            'unit_price' => $item->unit_price,
            'price_on_request' => $item->price_on_request,
            'quantity' => $item->quantity,
            'line_total' => $item->line_total,
            'sort_order' => $sortOrder,
        ]);
    }
}
