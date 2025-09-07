<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiateRegistrationRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Requests\SetPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\CompleteProfileRequest;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function initiateRegistration(InitiateRegistrationRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->initiateRegistration(
                $request->phone,
                $request->country_code
            );

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => $result['exists'] 
                    ? ($result['verified'] ? 'User already exists' : 'OTP sent to existing user')
                    : 'OTP sent successfully',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
            ], 500);
        }
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->verifyPhoneAndCreateUser(
                $request->phone,
                $request->country_code,
                $request->otp_code
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'next_step' => $result['next_step'],
                ],
                'message' => 'Phone verified successfully',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function setPassword(SetPasswordRequest $request): JsonResponse
    {
        try {
            $user = User::where('phone', $request->phone)
                ->where('country_code', $request->country_code)
                ->whereNotNull('phone_verified_at')
                ->whereNull('password')
                ->firstOrFail();

            $result = $this->authService->setPassword($user, $request->password);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'next_step' => $result['next_step'],
                ],
                'message' => 'Password set successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set password',
            ], 400);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->phone,
                $request->country_code,
                $request->password
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'token' => $result['token'],
                    'profile_complete' => $result['profile_complete'],
                    'missing_steps' => $result['missing_steps'],
                ],
                'message' => 'Login successful',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function completeProfile(CompleteProfileRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $result = $this->authService->completeProfile($user, $request->validated());

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'profile_complete' => $result['profile_complete'],
                ],
                'message' => 'Profile updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
            ], 400);
        }
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load(['country', 'city', 'profession']),
                'profile_complete' => $user->isProfileComplete(),
                'missing_steps' => $user->getMissingProfileSteps(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
            ],
            'message' => 'Token refreshed successfully',
        ]);
    }
}