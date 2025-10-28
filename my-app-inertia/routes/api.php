<?php

use App\Http\Controllers\Api\AccountSettingsController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Rute Autentikasi
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->group(function () {
    // Pengaturan Akun
    Route::put('/account/settings', [AccountSettingsController::class, 'updateApi']);

    Route::prefix('admin')->group(function () {
        Route::post('/categories', [ProductController::class, 'storeCategory']);
        Route::put('/categories/{id}', [ProductController::class, 'updateCategory']);
        // Route::delete('/categories/{id}', [ProductController::class, 'destroyCategory']);
        
        // Route::post('/products', [ProductController::class, 'storeProduct']);
        // Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
        // Route::delete('/products/{id}', [ProductController::class, 'destroyProduct']);
    });
});
