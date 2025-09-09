<?php
// app/Models/OtpVerification.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OtpVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'country_code',
        'otp_code',
        'type',
        'method',
        'expires_at',
        'verified_at',
        'is_used',
        'attempts',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->is_used && !$this->isExpired() && $this->attempts < 3;
    }

    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'verified_at' => now(),
        ]);
    }

    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
            ->where('expires_at', '>', now())
            ->where('attempts', '<', 3);
    }

    public function scopeForPhone($query, string $phone, string $country_code)
    {
        return $query->where('phone', $phone)
            ->where('country_code', $country_code);
    }
}