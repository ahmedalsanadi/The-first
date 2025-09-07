<?php
// database/factories/CountryFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CountryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->country(),
            'code' => $this->faker->unique()->countryCode(),
            'phone_code' => '+' . $this->faker->numberBetween(1, 999),
            'is_active' => true,
        ];
    }

    public function yemen(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Yemen',
            'code' => 'YE',
            'phone_code' => '+967',
        ]);
    }

    public function saudi(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Saudi Arabia',
            'code' => 'SA',
            'phone_code' => '+966',
        ]);
    }
}