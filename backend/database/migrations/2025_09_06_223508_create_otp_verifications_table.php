<?php
// database/migrations/2024_01_01_000006_create_otp_verifications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->string('country_code', 5);
            $table->string('otp_code', 4);
            $table->enum('type', ['registration', 'login', 'password_reset']);
            $table->enum('method', ['sms', 'whatsapp']); // Based on country
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->boolean('is_used')->default(false);
            $table->integer('attempts')->default(0);
            $table->timestamps();
            
            $table->index(['phone', 'country_code', 'type']);
            $table->index(['otp_code', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};