<?php
// app/Services/OtpService.php

namespace App\Services;

use App\Models\OtpVerification;
use App\Models\Country;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function generateOtp(string $phone, string $countryCode, string $type = 'registration'): array
    {
        // Generate 4-digit OTP
        $otpCode = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        // Determine method based on country
        $method = $this->determineOtpMethod($countryCode);

        // Delete any existing OTP for this phone and type
        OtpVerification::where('phone', $phone)
            ->where('country_code', $countryCode)
            ->where('type', $type)
            ->delete();

        // Create new OTP
        $otp = OtpVerification::create([
            'phone' => $phone,
            'country_code' => $countryCode,
            'otp_code' => $otpCode,
            'type' => $type,
            'method' => $method,
            'expires_at' => Carbon::now()->addMinutes(5), // 5 minutes expiry
        ]);

        // Send OTP via appropriate method
        $sent = $this->sendOtp($phone, $countryCode, $otpCode, $method);

        return [
            'success' => $sent,
            'method' => $method,
            'expires_at' => $otp->expires_at,
        ];
    }

    public function verifyOtp(string $phone, string $countryCode, string $otpCode, string $type = 'registration'): bool
    {
        $otp = OtpVerification::forPhone($phone, $countryCode)
            ->where('type', $type)
            ->where('otp_code', $otpCode)
            ->valid()
            ->first();

        if (!$otp) {
            // Increment attempts for any existing OTP
            OtpVerification::forPhone($phone, $countryCode)
                ->where('type', $type)
                ->where('otp_code', $otpCode)
                ->get()
                ->each(fn($otp) => $otp->incrementAttempts());

            return false;
        }

        $otp->markAsUsed();
        return true;
    }

    private function determineOtpMethod(string $countryCode): string
    {
        // SMS for Yemen, WhatsApp for others
        return $countryCode === '+967' ? 'sms' : 'whatsapp';
    }

    private function sendOtp(string $phone, string $countryCode, string $otpCode, string $method): bool
    {
        try {
            if ($method === 'sms') {
                return $this->sendSms($phone, $countryCode, $otpCode);
            } else {
                return $this->sendWhatsApp($phone, $countryCode, $otpCode);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send OTP', [
                'phone' => $phone,
                'country_code' => $countryCode,
                'method' => $method,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function sendSms(string $phone, string $countryCode, string $otpCode): bool
    {
        // Integration with Addon SMS service
        // This is a placeholder - replace with actual Addon API integration

        $message = "Your verification code is: {$otpCode}. Valid for 5 minutes.";

        // TODO: Implement actual SMS sending via Addon
        Log::info('SMS OTP sent', [
            'phone' => $countryCode . $phone,
            'code' => $otpCode,
        ]);

        return true; // Simulate success
    }

    private function sendWhatsApp(string $phone, string $countryCode, string $otpCode): bool
    {
        // Integration with Addon WhatsApp service
        // This is a placeholder - replace with actual Addon API integration

        $message = "Your verification code is: {$otpCode}. Valid for 5 minutes.";

        // TODO: Implement actual WhatsApp sending via Addon
        Log::info('WhatsApp OTP sent', [
            'phone' => $countryCode . $phone,
            'code' => $otpCode,
        ]);

        return true; // Simulate success
    }
}