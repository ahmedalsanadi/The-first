<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\Country;
use App\Models\City;
use App\Models\Profession;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    // database/factories/UserFactory.php

    public function definition(): array
    {
        // Get existing Yemen country or create it if doesn't exist
        $yemen = Country::where('code', 'YE')->first();

        if (!$yemen) {
            $yemen = Country::create([
                'name' => 'Yemen',
                'code' => 'YE',
                'phone_code' => '+967',
                'is_active' => true,
            ]);
        }

        $yemenPrefixes = ['70', '71', '73', '77', '78'];
        $prefix = $this->faker->randomElement($yemenPrefixes);
        $phone = $prefix . $this->faker->numerify('#######');

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $phone,
            'country_code' => '+967',
            'phone_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'country_id' => $yemen->id, // Use existing country ID
            'city_id' => City::factory(),
            'profession_id' => Profession::factory(),
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'profile_completion_steps' => ['phone_verified', 'password_set', 'profession_selected'],
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'phone_verified_at' => null,
            'profile_completion_steps' => [],
        ]);
    }

    public function incomplete(): static
    {
        return $this->state(fn(array $attributes) => [
            'profession_id' => null,
            'profile_completion_steps' => ['phone_verified', 'password_set'],
        ]);
    }
}