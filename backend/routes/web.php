<?php
// routes/web.php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Guest routes
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [AuthController::class, 'login']);
    });

    // Authenticated routes
    Route::middleware('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        // User management
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('{user}', [UserController::class, 'show'])->name('show');
            Route::post('{user}/toggle-status', [UserController::class, 'toggleStatus'])
                ->name('toggle-status');
        });
    });
});

// Redirect root to admin
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });