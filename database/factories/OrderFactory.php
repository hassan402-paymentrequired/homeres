<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Services\OrderNumberGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 150000, 8500000);
        $shippingTotal = fake()->randomElement([0, 0, 0, 25000, 45000]);
        $placedAt = fake()->dateTimeBetween('-30 days', 'now');

        return [
            'order_number' => app(OrderNumberGenerator::class)->generate(
                Carbon::instance($placedAt),
            ),
            'status' => fake()->randomElement(OrderStatus::cases()),
            'payment_status' => PaymentStatus::Paid,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->optional()->numerify('+23480########'),
            'shipping_address' => fake()->streetAddress(),
            'shipping_city' => fake()->randomElement(['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']),
            'shipping_state' => fake()->randomElement(['Lagos', 'FCT', 'Rivers', 'Oyo']),
            'customer_note' => fake()->optional()->sentence(),
            'admin_note' => null,
            'subtotal' => $subtotal,
            'shipping_total' => $shippingTotal,
            'total' => $subtotal + $shippingTotal,
            'has_price_on_request_items' => false,
            'currency' => 'NGN',
            'placed_at' => $placedAt,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Pending,
        ]);
    }

    public function withPriceOnRequestItems(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_price_on_request_items' => true,
            'subtotal' => null,
            'total' => null,
        ]);
    }
}
