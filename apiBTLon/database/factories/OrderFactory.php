<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_code' => 'ORD-' . strtoupper(Str::random(10)),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->unique()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'customer_address' => fake()->address(),
            'payment_method' => fake()->randomElement(['cod', 'bank_transfer', 'momo']),
            'total_amount' => fake()->numberBetween(100, 5000) * 1000,
            'status' => OrderStatus::PENDING->value,
            'cancel_token' => Str::random(40),
            'cancel_token_expires_at' => now()->addHours(24),
        ];
    }
}
