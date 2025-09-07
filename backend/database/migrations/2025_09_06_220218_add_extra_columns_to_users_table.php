<?php
// database/migrations/2024_01_02_000001_add_extra_columns_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('country_code', 5)->after('phone');
            $table->timestamp('phone_verified_at')->nullable()->after('country_code');
            $table->timestamp('email_verified_at')->nullable()->after('phone_verified_at');

            $table->foreignId('country_id')->nullable()
                ->after('email_verified_at')
                ->constrained('countries')
                ->nullOnDelete();

            $table->foreignId('city_id')->nullable()
                ->after('country_id')
                ->constrained('cities')
                ->nullOnDelete();

            $table->foreignId('profession_id')->nullable()
                ->after('city_id')
                ->constrained('professions')
                ->nullOnDelete();

            $table->date('birth_date')->nullable()->after('profession_id');
            $table->enum('gender', ['male', 'female'])->nullable()->after('birth_date');
            $table->json('profile_completion_steps')->nullable()->after('gender');
            $table->boolean('is_active')->default(true)->after('profile_completion_steps');
            $table->timestamp('last_login_at')->nullable()->after('is_active');

            $table->index(['phone', 'country_code']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['phone', 'country_code']);
            $table->dropColumn([
                'country_code',
                'phone_verified_at',
                'email_verified_at',
                'country_id',
                'city_id',
                'profession_id',
                'birth_date',
                'gender',
                'profile_completion_steps',
                'is_active',
                'last_login_at'
            ]);
        });
    }
};
