<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'path' => 'products/'.fake()->uuid().'.jpg',
            'url' => null,
            'alt' => fake()->optional()->sentence(3),
            'sort_order' => 0,
        ];
    }

    public function external(string $url): static
    {
        return $this->state(fn (array $attributes) => [
            'path' => null,
            'url' => $url,
        ]);
    }
}
