<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,    // Creates specific countries first
            CitySeeder::class,       // Creates cities for those countries
            ProfessionSeeder::class, // Creates professions
            AdminSeeder::class,      // Creates admin users
        ]);

        // Create test users - but make sure they use existing countries/cities
        User::factory(50)->create();
        User::factory(10)->unverified()->create();
        User::factory(5)->incomplete()->create();
    }
}