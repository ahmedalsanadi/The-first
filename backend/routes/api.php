<?php
// routes/api.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('initiate-registration', [AuthController::class, 'initiateRegistration']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('set-password', [AuthController::class, 'setPassword']);
    Route::post('login', [AuthController::class, 'login']);
});

// Data routes
Route::prefix('data')->group(function () {
    Route::get('countries', [DataController::class, 'countries']);
    Route::get('cities', [DataController::class, 'cities']);
    Route::get('professions', [DataController::class, 'professions']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh-token', [AuthController::class, 'refreshToken']);
        Route::post('complete-profile', [AuthController::class, 'completeProfile']);
    });

    // Routes that require complete profile
    Route::middleware('profile.complete')->group(function () {
        // Add your protected routes here that require complete profile
        // Route::apiResource('products', ProductController::class);
        // Route::apiResource('ads', AdController::class);
    });
});