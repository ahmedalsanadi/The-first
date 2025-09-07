<?php
// database/seeders/ProfessionSeeder.php

namespace Database\Seeders;

use App\Models\Profession;
use Illuminate\Database\Seeder;

class ProfessionSeeder extends Seeder
{
    public function run(): void
    {
        $professions = [
            ['name' => 'Engineer', 'name_ar' => 'مهندس'],
            ['name' => 'Doctor', 'name_ar' => 'طبيب'],
            ['name' => 'Teacher', 'name_ar' => 'معلم'],
            ['name' => 'Businessman', 'name_ar' => 'رجل أعمال'],
            ['name' => 'Student', 'name_ar' => 'طالب'],
            ['name' => 'Employee', 'name_ar' => 'موظف'],
            ['name' => 'Contractor', 'name_ar' => 'مقاول'],
            ['name' => 'Lawyer', 'name_ar' => 'محامي'],
            ['name' => 'Accountant', 'name_ar' => 'محاسب'],
            ['name' => 'Technician', 'name_ar' => 'فني'],
            ['name' => 'Driver', 'name_ar' => 'سائق'],
            ['name' => 'Trader', 'name_ar' => 'تاجر'],
        ];

        foreach ($professions as $profession) {
            Profession::create($profession);
        }
    }
}