<?php
// database/seeders/CountrySeeder.php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ['name' => 'Yemen', 'code' => 'YE', 'phone_code' => '+967'],
            ['name' => 'Saudi Arabia', 'code' => 'SA', 'phone_code' => '+966'],
            ['name' => 'United Arab Emirates', 'code' => 'AE', 'phone_code' => '+971'],
            ['name' => 'Egypt', 'code' => 'EG', 'phone_code' => '+20'],
            ['name' => 'Jordan', 'code' => 'JO', 'phone_code' => '+962'],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}