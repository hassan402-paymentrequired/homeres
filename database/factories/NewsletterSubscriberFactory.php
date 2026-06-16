<?php

namespace Database\Factories;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NewsletterSubscriber>
 */
class NewsletterSubscriberFactory extends Factory
{
    protected $model = NewsletterSubscriber::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'source' => fake()->randomElement(['modal', 'footer']),
            'subscribed_at' => now(),
        ];
    }

    public function fromModal(): static
    {
        return $this->state(fn (): array => ['source' => 'modal']);
    }

    public function fromFooter(): static
    {
        return $this->state(fn (): array => ['source' => 'footer']);
    }
}
