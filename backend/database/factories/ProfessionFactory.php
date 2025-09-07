<?php
// database/factories/ProfessionFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProfessionFactory extends Factory
{
    public function definition(): array
    {
        $professions = [
            ['name' => 'Engineer', 'name_ar' => 'مهندس'],
            ['name' => 'Doctor', 'name_ar' => 'طبيب'],
            ['name' => 'Teacher', 'name_ar' => 'معلم'],
            ['name' => 'Businessman', 'name_ar' => 'رجل أعمال'],
            ['name' => 'Student', 'name_ar' => 'طالب'],
            ['name' => 'Employee', 'name_ar' => 'موظف'],
            ['name' => 'Contractor', 'name_ar' => 'مقاول'],
        ];

        $profession = $this->faker->randomElement($professions);

        return [
            'name' => $profession['name'],
            'name_ar' => $profession['name_ar'],
            'is_active' => true,
        ];
    }
}