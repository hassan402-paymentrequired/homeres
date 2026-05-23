<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\ProductTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'parent_id' => null,
            'product_template_id' => ProductTemplate::factory(),
            'name' => Str::title($name),
            'handle' => Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'nav_group_label' => null,
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => true,
            'show_in_nav' => true,
            'is_aggregate' => false,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function aggregate(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_aggregate' => true,
        ]);
    }

    public function forParent(Category $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
        ]);
    }
}
