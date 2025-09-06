<?php
// database/factories/CityFactory.php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    public function definition(): array
    {
        $cityName = $this->faker->city();
        
        return [
            'name' => $cityName,
            'name_ar' => $this->faker->city(), // In real app, translate to Arabic
            'country_id' => Country::factory(),
            'is_active' => true,
        ];
    }

    public function yemeniCities(): static
    {
        return $this->state(function (array $attributes) {
            $cities = [
                ['name' => 'Sanaa', 'name_ar' => 'صنعاء'],
                ['name' => 'Aden', 'name_ar' => 'عدن'],
                ['name' => 'Taiz', 'name_ar' => 'تعز'],
                ['name' => 'Hodeidah', 'name_ar' => 'الحديدة'],
                ['name' => 'Ibb', 'name_ar' => 'إب'],
            ];
            
            $city = $this->faker->randomElement($cities);
            
            return [
                'name' => $city['name'],
                'name_ar' => $city['name_ar'],
            ];
        });
    }
}