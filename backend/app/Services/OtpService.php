<?php
// app/Services/OtpService.php

namespace App\Services;

use App\Models\OtpVerification;
use App\Models\Country;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function generateOtp(string $phone, string $country_code, string $type = 'registration'): array
    {
        // Generate 4-digit OTP
        $otpCode = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        // Determine method based on country
        $method = $this->determineOtpMethod($country_code);

        // Delete any existing OTP for this phone and type
        OtpVerification::where('phone', $phone)
            ->where('country_code', $country_code)
            ->where('type', $type)
            ->delete();

        // Create new OTP
        $otp = OtpVerification::create([
            'phone' => $phone,
            'country_code' => $country_code,
            'otp_code' => $otpCode,
            'type' => $type,
            'method' => $method,
            'expires_at' => Carbon::now()->addMinutes(5), // 5 minutes expiry
        ]);

        // Send OTP via appropriate method
        $sent = $this->sendOtp($phone, $country_code, $otpCode, $method);

        return [
            'success' => $sent,
            'method' => $method,
            'expires_at' => $otp->expires_at,
        ];
    }

    public function verifyOtp(string $phone, string $country_code, string $otpCode, string $type = 'registration'): bool
    {
        $otp = OtpVerification::forPhone($phone, $country_code)
            ->where('type', $type)
            ->where('otp_code', $otpCode)
            ->valid()
            ->first();

        if (!$otp) {
            // Increment attempts for any existing OTP
            OtpVerification::forPhone($phone, $country_code)
                ->where('type', $type)
                ->where('otp_code', $otpCode)
                ->get()
                ->each(fn($otp) => $otp->incrementAttempts());

            return false;
        }

        $otp->markAsUsed();
        return true;
    }

    private function determineOtpMethod(string $country_code): string
    {
        // SMS for Yemen, WhatsApp for others
        return $country_code === '+967' ? 'sms' : 'whatsapp';
    }

    private function sendOtp(string $phone, string $country_code, string $otpCode, string $method): bool
    {
        try {
            if ($method === 'sms') {
                return $this->sendSms($phone, $country_code, $otpCode);
            } else {
                return $this->sendWhatsApp($phone, $country_code, $otpCode);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send OTP', [
                'phone' => $phone,
                'country_code' => $country_code,
                'method' => $method,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function sendSms(string $phone, string $country_code, string $otpCode): bool
    {
        // Integration with Addon SMS service
        // This is a placeholder - replace with actual Addon API integration

        $message = "Your verification code is: {$otpCode}. Valid for 5 minutes.";

        // TODO: Implement actual SMS sending via Addon
        Log::info('SMS OTP sent', [
            'phone' => $country_code . $phone,
            'code' => $otpCode,
        ]);

        return true; // Simulate success
    }

    private function sendWhatsApp(string $phone, string $country_code, string $otpCode): bool
    {
        // Integration with Addon WhatsApp service
        // This is a placeholder - replace with actual Addon API integration

        $message = "Your verification code is: {$otpCode}. Valid for 5 minutes.";

        // TODO: Implement actual WhatsApp sending via Addon
        Log::info('WhatsApp OTP sent', [
            'phone' => $country_code . $phone,
            'code' => $otpCode,
        ]);

        return true; // Simulate success
    }
}