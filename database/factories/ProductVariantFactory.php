<?php

namespace Database\Factories;

use App\Enums\StockStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => 'Default',
            'sku' => fake()->optional()->bothify('SKU-####'),
            'option_values' => null,
            'price' => fake()->randomFloat(2, 50000, 5000000),
            'price_on_request' => false,
            'stock_status' => StockStatus::InStore,
            'lead_time_days_air' => null,
            'lead_time_days_sea' => null,
            'weight_kg' => fake()->optional()->randomFloat(3, 0.5, 120),
            'quantity' => fake()->optional()->numberBetween(0, 20),
            'sort_order' => 1,
            'is_active' => true,
        ];
    }

    public function inStore(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_status' => StockStatus::InStore,
            'lead_time_days_air' => null,
            'lead_time_days_sea' => null,
        ]);
    }

    public function inStockRemote(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_status' => StockStatus::InStockRemote,
            'lead_time_days_air' => fake()->numberBetween(5, 14),
            'lead_time_days_sea' => fake()->numberBetween(30, 60),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_status' => StockStatus::OutOfStock,
            'lead_time_days_air' => null,
            'lead_time_days_sea' => null,
        ]);
    }
}
