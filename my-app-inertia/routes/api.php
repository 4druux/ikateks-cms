<?php

use App\Http\Controllers\Api\Admin\AccountSettingsController;
use App\Http\Controllers\Api\Admin\CustomersController;
use App\Http\Controllers\Api\Admin\NewsController;
use App\Http\Controllers\Api\Admin\PrincipalsController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\PublicCustomersController;
use App\Http\Controllers\Api\PublicNewsController;
use App\Http\Controllers\Api\PublicPrincipalsController;
use App\Http\Controllers\Api\PublicProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Rute Autentikasi
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Public Routes
Route::get('/categories', [PublicProductController::class, 'indexCategories']);
Route::get('/categories', [PublicProductController::class, 'indexCategories']);
Route::get('/categories/{category}/products', [PublicProductController::class, 'indexProducts']);
Route::get('/products/{product}', [PublicProductController::class, 'showProduct']);

Route::get('/news', [PublicNewsController::class, 'index']);
Route::get('/news/{news}', [PublicNewsController::class, 'show']);

Route::get('/principals', [PublicPrincipalsController::class, 'index']);
Route::get('/customers', [PublicCustomersController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::put('/account/settings', [AccountSettingsController::class, 'updateApi']);

        Route::get('/categories', [ProductController::class, 'indexCategories'])->name('categories.index');
        Route::post('/categories', [ProductController::class, 'storeCategory'])->name('categories.store');
        Route::get('/categories/{category}', [ProductController::class, 'showCategory'])->name('categories.show');
        Route::put('/categories/{category}', [ProductController::class, 'updateCategory'])->name('categories.update');
        Route::delete('/categories/{category:id}', [ProductController::class, 'destroyCategory'])->name('categories.destroy');

        Route::get('/categories/products/{category}', [ProductController::class, 'indexProducts'])->name('categories.products.index');
        Route::post('/products', [ProductController::class, 'storeProduct'])->name('products.store');
        Route::get('/products/{product}', [ProductController::class, 'showProduct'])->name('products.show');
        Route::put('/products/{product}', [ProductController::class, 'updateProduct'])->name('products.update');
        Route::delete('/products/{product:id}', [ProductController::class, 'destroyProduct'])->name('products.destroy');

        Route::get('/news', [NewsController::class, 'index'])->name('news.index');
        Route::post('/news', [NewsController::class, 'store'])->name('news.store');
        Route::get('/news/{news}', [NewsController::class, 'show'])->name('news.show');
        Route::post('/news/{news}', [NewsController::class, 'update'])->name('news.update');
        Route::delete('/news/{news:id}', [NewsController::class, 'destroy'])->name('news.destroy');
        
        Route::get('/principals', [PrincipalsController::class, 'index'])->name('principals.index');
        Route::post('/principals', [PrincipalsController::class, 'store'])->name('principals.store');
        Route::delete('/principals/{principal}', [PrincipalsController::class, 'destroy'])->name('principals.destroy');

        Route::get('/customers', [CustomersController::class, 'index'])->name('customers.index');
        Route::post('/customers', [CustomersController::class, 'store'])->name('customers.store');
        Route::delete('/customers/{customer}', [CustomersController::class, 'destroy'])->name('customers.destroy');
    });
});