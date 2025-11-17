<?php

use App\Http\Controllers\Api\Admin\{
    AboutController,
    AccountSettingsController,
    CustomersController,
    DashboardController,
    HeroController,
    NewsController,
    PrincipalsController,
    ProductController,
    PublicSettingsController,
    SettingsController,
    UserManagementController
};

use App\Http\Controllers\Api\{
    PublicAboutController,
    PublicCustomersController,
    PublicHeroController,
    PublicNewsController,
    PublicPrincipalsController,
    PublicProductController
};

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Rute Autentikasi
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register')->name('register');
    Route::post('/login', 'login')->name('login');
    Route::post('/logout', 'logout')->name('logout');
});

// Public Routes
Route::get('/hero', [PublicHeroController::class, 'index']);

Route::controller(PublicProductController::class)->group(function () {
    Route::get('/categories', 'indexCategories');
    Route::get('/categories/{category}/products', 'indexProducts');
    Route::get('/products/{product}', 'showProduct');
    Route::get('/products/{product}/subproducts', 'indexSubProducts');
});

Route::controller(PublicNewsController::class)->group(function () {
    Route::get('/news', 'index');
    Route::get('/news/{news}', 'show');
});

Route::controller(PublicPrincipalsController::class)->group(function () {
    Route::get('/principals', 'index');
    Route::get('/principals-logo', 'indexLogo');
});

Route::get('/about', [PublicAboutController::class, 'index']);
Route::get('/company-advantages', [PublicAboutController::class, 'getAdvantages']);
Route::get('/customers', [PublicCustomersController::class, 'index']);
Route::get('/settings', [PublicSettingsController::class, 'index']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::put('/account/settings', [AccountSettingsController::class, 'updateApi']);
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');

    Route::controller(AboutController::class)->prefix('about')->name('about.')->group(function () {
        Route::get('/', 'indexAbout')->name('index');
        Route::post('/', 'storeAbout')->name('store');
        Route::get('/{about}', 'showAbout')->name('show');
        Route::put('/{about}', 'updateAbout')->name('update');
        Route::delete('/{about:id}', 'destroyAbout')->name('destroy');
    });

    Route::controller(AboutController::class)->prefix('company-advantages')->name('advantages.')->group(function () {
        Route::get('/', 'indexAdvantages')->name('index');
        Route::post('/', 'storeAdvantage')->name('store');
        Route::get('/{advantage}', 'showAdvantage')->name('show');
        Route::put('/{advantage}', 'updateAdvantage')->name('update');
        Route::delete('/{advantage:id}', 'destroyAdvantage')->name('destroy');
    });

    Route::controller(ProductController::class)->group(function () {
        Route::get('/categories', 'indexCategories')->name('categories.index');
        Route::post('/categories', 'storeCategory')->name('categories.store');
        Route::get('/categories/{category}', 'showCategory')->name('categories.show');
        Route::put('/categories/{category}', 'updateCategory')->name('categories.update');
        Route::delete('/categories/{category:id}', 'destroyCategory')->name('categories.destroy');

        Route::get('/categories/products/{category}', 'indexProducts')->name('categories.products.index');
        
        Route::post('/products', 'storeProduct')->name('products.store');
        Route::get('/products/{product}', 'showProduct')->name('products.show');
        Route::put('/products/{product}', 'updateProduct')->name('products.update');
        Route::delete('/products/{product:id}', 'destroyProduct')->name('products.destroy');

        Route::get('/products/{product}/subproducts', 'indexSubProducts')->name('products.subproducts.index');
        Route::post('/subproducts', 'storeSubProduct')->name('subproducts.store');
        Route::get('/subproducts/{subProduct}', 'showSubProduct')->name('subproducts.show');
        Route::put('/subproducts/{subProduct}', 'updateSubProduct')->name('subproducts.update');
        Route::delete('/subproducts/{subProduct:id}', 'destroySubProduct')->name('subproducts.destroy');
    });

    Route::controller(NewsController::class)->prefix('news')->name('news.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{news}', 'show')->name('show');
        Route::put('/{news}', 'update')->name('update');
        Route::delete('/{news:id}', 'destroy')->name('destroy');
    });
        
    Route::controller(PrincipalsController::class)->prefix('principals')->name('principals.')->group(function () {
        Route::get('/logo', 'indexLogo')->name('logo.index');
        Route::post('/logo', 'storeLogo')->name('logo.store');
        Route::delete('/logo/{principal}', 'destroyLogo')->name('logo.destroy');
        
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{principal}', 'update')->name('update');
        Route::get('/{principal}', 'show')->name('show');
        Route::delete('/{principal:id}', 'destroy')->name('destroy');
        
    });

    Route::controller(CustomersController::class)->prefix('customers')->name('customers.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::delete('/{customer}', 'destroy')->name('destroy');
    });

    Route::controller(UserManagementController::class)->prefix('users')->group(function () {
        Route::get('/', 'index');
        Route::put('/{user}', 'update');
        Route::delete('/{user}', 'destroy');
        Route::post('/{user}/approve', 'approve');
        Route::put('/{user}/reset-password', 'resetPassword');
    });

    Route::controller(HeroController::class)->prefix('hero')->name('hero.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{hero:page_key}', 'show')->name('show');
        Route::put('/{hero:page_key}', 'update')->name('update');
    });

    Route::controller(SettingsController::class)->prefix('settings')->group(function () {
        Route::get('/', 'show');
        Route::post('/', 'update');
    });
});