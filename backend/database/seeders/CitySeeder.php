<?php
// database/seeders/CitySeeder.php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $yemen = Country::where('code', 'YE')->first();
        
        if ($yemen) {
            $yemeniCities = [
                ['name' => 'Sanaa', 'name_ar' => 'صنعاء'],
                ['name' => 'Aden', 'name_ar' => 'عدن'],
                ['name' => 'Taiz', 'name_ar' => 'تعز'],
                ['name' => 'Hodeidah', 'name_ar' => 'الحديدة'],
                ['name' => 'Ibb', 'name_ar' => 'إب'],
                ['name' => 'Dhamar', 'name_ar' => 'ذمار'],
                ['name' => 'Mukalla', 'name_ar' => 'المكلا'],
                ['name' => 'Sayun', 'name_ar' => 'سيئون'],
            ];

            foreach ($yemeniCities as $city) {
                City::create([
                    'name' => $city['name'],
                    'name_ar' => $city['name_ar'],
                    'country_id' => $yemen->id,
                ]);
            }
        }

        // Add cities for other countries
        $saudi = Country::where('code', 'SA')->first();
        if ($saudi) {
            $saudiCities = [
                ['name' => 'Riyadh', 'name_ar' => 'الرياض'],
                ['name' => 'Jeddah', 'name_ar' => 'جدة'],
                ['name' => 'Mecca', 'name_ar' => 'مكة'],
                ['name' => 'Medina', 'name_ar' => 'المدينة'],
            ];

            foreach ($saudiCities as $city) {
                City::create([
                    'name' => $city['name'],
                    'name_ar' => $city['name_ar'],
                    'country_id' => $saudi->id,
                ]);
            }
        }
    }
}