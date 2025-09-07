<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'country_code',
        'password',
        'country_id',
        'city_id',
        'profession_id',
        'birth_date',
        'gender',
        'profile_completion_steps',
        'phone_verified_at',
        'email_verified_at',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'phone_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'birth_date' => 'date',
        'profile_completion_steps' => 'array',
        'is_active' => 'boolean',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function profession(): BelongsTo
    {
        return $this->belongsTo(Profession::class);
    }

    public function getFullPhoneAttribute(): string
    {
        return $this->country_code . $this->phone;
    }

    public function isPhoneVerified(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    public function isProfileComplete(): bool
    {
        $requiredSteps = ['phone_verified', 'password_set', 'profession_selected'];
        $completedSteps = $this->profile_completion_steps ?? [];
        
        return empty(array_diff($requiredSteps, $completedSteps));
    }

    public function getMissingProfileSteps(): array
    {
        $requiredSteps = ['phone_verified', 'password_set', 'profession_selected'];
        $completedSteps = $this->profile_completion_steps ?? [];
        
        return array_diff($requiredSteps, $completedSteps);
    }

    public function markStepAsCompleted(string $step): void
    {
        $steps = $this->profile_completion_steps ?? [];
        if (!in_array($step, $steps)) {
            $steps[] = $step;
            $this->update(['profile_completion_steps' => $steps]);
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull('phone_verified_at');
    }
}