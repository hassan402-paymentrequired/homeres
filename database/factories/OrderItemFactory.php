<?php

namespace Database\Factories;

use App\Enums\StockStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $variant = ProductVariant::factory()->create();
        $variant->load('product');
        $quantity = fake()->numberBetween(1, 3);
        $unitPrice = $variant->price_on_request ? null : $variant->price;
        $lineTotal = $unitPrice !== null ? bcmul((string) $unitPrice, (string) $quantity, 2) : null;

        return [
            'order_id' => Order::factory(),
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'product_name' => $variant->product->name,
            'variant_name' => $variant->name,
            'sku' => $variant->sku,
            'stock_status' => $variant->stock_status,
            'unit_price' => $unitPrice,
            'price_on_request' => $variant->price_on_request,
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
            'stock_status' => StockStatus::OutOfStock,
        ]);
    }

    public function forVariant(ProductVariant $variant, int $quantity = 1): static
    {
        $variant->loadMissing('product');
        $unitPrice = $variant->price_on_request ? null : $variant->price;
        $lineTotal = $unitPrice !== null ? bcmul((string) $unitPrice, (string) $quantity, 2) : null;

        return $this->state(fn (array $attributes) => [
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'product_name' => $variant->product->name,
            'variant_name' => $variant->name,
            'sku' => $variant->sku,
            'stock_status' => $variant->stock_status,
            'unit_price' => $unitPrice,
            'price_on_request' => $variant->price_on_request,
            'quantity' => $quantity,
            'line_total' => $lineTotal,
        ]);
    }
}
