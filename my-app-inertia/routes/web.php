<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

Route::get('/', function () { return Inertia::render('Users/HomePage'); })->name('home');
Route::get('/about', function () { return Inertia::render('Users/AboutPage'); })->name('about');
Route::get('/principals', function () { return Inertia::render('Users/PrincipalsPage'); })->name('principals');
Route::get('/news', function () { return Inertia::render('Users/NewsPage'); })->name('news');
Route::get('/news/{slug}', function ($slug) {
    return Inertia::render('Users/NewsPage', [
        'initialSlug' => $slug 
    ]);
})->name('news.detail');
Route::get('/customers', function () { return Inertia::render('Users/CustomersPage'); })->name('customer');
Route::get('/contact', function () { return Inertia::render('Users/ContactPage'); })->name('contact');
Route::get('/privacy-policy', function () { return Inertia::render( 'Users/PrivacyPolicyPage'); })->name('privacyPolicy');

// Products
Route::get('/products', function () { 
    return Inertia::render('Users/ProductCategoriesPage'); 
})->name('products.index');

Route::get('/products/{categorySlug}', function ($categorySlug) { 
    return Inertia::render('Users/ProductCategoryDetailPage', [
        'categorySlug' => $categorySlug,
    ]); 
})->name('products.category');

Route::get('/products/{categorySlug}/{productSlug}', function ($categorySlug, $productSlug) { 
    return Inertia::render('Users/ProductDetailPage', [
        'categorySlug' => $categorySlug,
        'productSlug' => $productSlug,
    ]); 
})->name('products.detail');

Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::inertia('/admin', 'Admin/HomePage')->name('home');

    // Categories
    Route::inertia('/admin/categories', 'Admin/Products/CategoriesPage')->name('categories');
    Route::inertia('/admin/categories/create', 'Admin/Products/CreateCategoriesPage')->name('create.categories');
    Route::get('/admin/categories/edit/{slug}', function ($slug) {
        return Inertia::render('Admin/Products/EditCategoriesPage', [
            'slug' => $slug
        ]);
    })->name('edit.categories');

    // Products
    Route::get('/admin/categories/{slug}', function ($slug) {
        return Inertia::render('Admin/Products/ProductsPage', [
            'categorySlug' => $slug
        ]);
    })->name('categories.products');
    Route::get('/admin/categories/{categorySlug}/create', function ($categorySlug) {
        return Inertia::render('Admin/Products/CreateProductsPage', [
            'categorySlug' => $categorySlug
        ]);
    })->name('products.create');
    Route::get('/admin/categories/{categorySlug}/edit/{productSlug}', function ($categorySlug, $productSlug) {
        return Inertia::render('Admin/Products/EditProductsPage', [
            'categorySlug' => $categorySlug,
            'slug' => $productSlug
        ]);
    })->name('products.edit');
    Route::get('/admin/categories/{categorySlug}/products/{productSlug}', function ($categorySlug, $productSlug) {
        return Inertia::render('Admin/Products/ProductDetailPage', [
            'categorySlug' => $categorySlug,
            'slug' => $productSlug
        ]);
    })->name('products.show');


    // News
    Route::inertia('/admin/news', 'Admin/News/NewsPage')->name('news');
    Route::inertia('/admin/news/create', 'Admin/News/CreateNewsPage')->name('create.news');
    Route::get('/admin/news/edit/{slug}', function ($slug) {
        return Inertia::render('Admin/News/EditNewsPage', [
            'slug' => $slug
        ]);
    })->name('edit.news');
    Route::get('/admin/news/{slug}', function ($slug) {
        return Inertia::render('Admin/News/NewsDetailPage', [
            'slug' => $slug
        ]);
    })->name('show.news');

    Route::inertia('/admin/principals', 'Admin/PrincipalsPage')->name('principals');
    Route::inertia('/admin/customers', 'Admin/CustomersPage')->name('customers');

    Route::inertia('/admin/account-settings', 'Admin/AccountSettingsPage')->name('account.settings');
});
