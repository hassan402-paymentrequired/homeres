<?php

namespace Database\Factories;

use App\Models\ProductTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductTemplate>
 */
class ProductTemplateFactory extends Factory
{
    protected $model = ProductTemplate::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);
        $slug = Str::slug($name);

        return [
            'slug' => $slug,
            'name' => Str::title($name),
            'description' => fake()->optional()->sentence(),
            'variant_options' => [],
            'spec_fields' => [],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => true,
            ],
            'is_system' => false,
        ];
    }

    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_system' => true,
        ]);
    }
}
