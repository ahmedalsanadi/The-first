<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiateRegistrationRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Requests\SetPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\CompleteProfileRequest;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function initiateRegistration(InitiateRegistrationRequest $request): JsonResponse
    {
        $result = $this->authService->initiateRegistration($request->phone, $request->country_code);

        return response()->json([
            'success' => true,
            'data'    => $result,
            'message' => $result['exists']
                ? ($result['verified'] ? 'User already exists' : 'OTP sent to existing user')
                : 'OTP sent successfully',
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $result = $this->authService->verifyPhoneAndCreateUser(
            $request->phone,
            $request->country_code,
            $request->otp_code
        );

        return response()->json([
            'success' => true,
            'data'    => [
                'user'      => $result['user'],
                'next_step' => $result['next_step'],
            ],
            'message' => 'Phone verified successfully',
        ]);
    }

    public function setPassword(SetPasswordRequest $request): JsonResponse
    {
        $user = User::where('phone', $request->phone)
            ->where('country_code', $request->country_code)
            ->whereNotNull('phone_verified_at')
            ->whereNull('password')
            ->firstOrFail();

        $result = $this->authService->setPassword($user, $request->password);

        return response()->json([
            'success' => true,
            'data'    => [
                'user'      => $result['user'],
                'next_step' => $result['next_step'],
            ],
            'message' => 'Password set successfully',
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->phone,
            $request->country_code,
            $request->password
        );

        return response()->json([
            'success' => true,
            'data'    => [
                'user'            => $result['user'],
                'token'           => $result['token'],
                'profile_complete'=> $result['profile_complete'],
                'missing_steps'   => $result['missing_steps'],
            ],
            'message' => 'Login successful',
        ]);
    }

    public function completeProfile(CompleteProfileRequest $request): JsonResponse
    {
        $result = $this->authService->completeProfile(auth()->user(), $request->validated());

        return response()->json([
            'success' => true,
            'data'    => [
                'user'             => $result['user'],
                'profile_complete' => $result['profile_complete'],
            ],
            'message' => 'Profile updated successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'user'            => $user->load(['country', 'city', 'profession']),
                'profile_complete'=> $user->isProfileComplete(),
                'missing_steps'   => $user->getMissingProfileSteps(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true, 'message' => 'Logged out successfully']);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data'    => ['token' => $user->createToken('auth_token')->plainTextToken],
            'message' => 'Token refreshed successfully',
        ]);
    }
}
