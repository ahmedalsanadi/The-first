<?php

namespace App\Services;

use App\Models\User;
use App\Models\Country;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private OtpService $otpService
    ) {
    }

    public function initiateRegistration(string $phone, string $country_code): array
    {
        if ($country_code === '+967') {
            $this->validateYemenPhoneNumber($phone);
        }

        $existingUser = User::where('phone', $phone)
            ->where('country_code', $country_code)
            ->first();

        if ($existingUser) {
            if ($existingUser->isPhoneVerified()) {
                return [
                    'exists' => true,
                    'verified' => true,
                    'message' => 'Phone number already registered. Please login.',
                ];
            }

            $otpResult = $this->otpService->generateOtp($phone, $country_code, 'registration');

            return [
                'exists' => true,
                'verified' => false,
                'otp_sent' => $otpResult['success'],
                'method' => $otpResult['method'],
            ];
        }

        $otpResult = $this->otpService->generateOtp($phone, $country_code, 'registration');

        return [
            'exists' => false,
            'otp_sent' => $otpResult['success'],
            'method' => $otpResult['method'],
        ];
    }

    public function verifyPhoneAndCreateUser(string $phone, string $country_code, string $otpCode): array
    {
        if (!$this->otpService->verifyOtp($phone, $country_code, $otpCode, 'registration')) {
            throw ValidationException::withMessages([
                'otp_code' => ['Invalid or expired verification code.'],
            ]);
        }

        $country = Country::where('phone_code', $country_code)->first();

        $user = User::updateOrCreate(
            ['phone' => $phone, 'country_code' => $country_code],
            [
                'phone_verified_at' => now(),
                'country_id' => $country?->id,
                'profile_completion_steps' => ['phone_verified'],
            ]
        );

        $user->markStepAsCompleted('phone_verified');

        return [
            'user' => $user,
            'next_step' => $this->getNextStep($user),
        ];
    }

    public function setPassword(User $user, string $password): array
    {
        $user->update([
            'password' => Hash::make($password),
        ]);

        $user->markStepAsCompleted('password_set');

        return [
            'user' => $user->fresh(),
            'next_step' => $this->getNextStep($user),
        ];
    }

    public function completeProfile(User $user, array $data): array
    {
        $user->update($data);

        if (isset($data['profession_id'])) {
            $user->markStepAsCompleted('profession_selected');
        }

        return [
            'user' => $user->fresh(),
            'profile_complete' => $user->isProfileComplete(),
        ];
    }

    public function login(string $phone, string $country_code, string $password): array
    {
        $user = User::where('phone', $phone)
            ->where('country_code', $country_code)
            ->where('is_active', true)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages(['phone' => ['Invalid credentials.']]);
        }

        if (!$user->isPhoneVerified()) {
            throw ValidationException::withMessages(['phone' => ['Phone number not verified.']]);
        }

        $user->update(['last_login_at' => now()]);

        return [
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
            'profile_complete' => $user->isProfileComplete(),
            'missing_steps' => $user->getMissingProfileSteps(),
        ];
    }

    private function validateYemenPhoneNumber(string $phone): void
    {
        $validPrefixes = ['70', '71', '73', '77', '78'];
        $prefix = substr($phone, 0, 2);

        if (!in_array($prefix, $validPrefixes) || strlen($phone) !== 9) {
            throw ValidationException::withMessages([
                'phone' => ['Invalid Yemen phone number format. Must start with 70, 71, 73, 77, or 78 and be 9 digits.'],
            ]);
        }
    }

    private function getNextStep(User $user): ?string
    {
        $missingSteps = $user->getMissingProfileSteps();

        if (in_array('password_set', $missingSteps)) {
            return 'set_password';
        }

        if (in_array('profession_selected', $missingSteps)) {
            return 'select_profession';
        }

        return null;
    }
}
