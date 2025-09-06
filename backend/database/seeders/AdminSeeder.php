<?php
// database/seeders/AdminSeeder.php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // Create regular admin
        Admin::create([
            'name' => 'Admin User',
            'email' => 'adminuser@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'permissions' => ['view_users', 'manage_ads', 'manage_affiliates'],
            'is_active' => true,
        ]);

        // Create moderator
        Admin::create([
            'name' => 'Moderator',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password'),
            'role' => 'moderator',
            'permissions' => ['view_users', 'moderate_content'],
            'is_active' => true,
        ]);
    }
}