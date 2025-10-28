<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/login', 'Auth/LoginPage')->name('login')->middleware('guest');
Route::inertia('/register', 'Auth/RegisterPage')->name('register')->middleware('guest');

Route::get('/', function () { return Inertia::render('HomePage'); })->name('home');
Route::get('/about', function () { return Inertia::render('AboutPage'); })->name('about');
Route::get('/principals', function () { return Inertia::render('PrincipalsPage'); })->name('principals');
Route::get('/news', function () { return Inertia::render('NewsPage'); })->name('news');
Route::get('/customers', function () { return Inertia::render('CustomersPage'); })->name('customer');
Route::get('/contact', function () { return Inertia::render('ContactPage'); })->name('contact');
Route::get('/privacy-policy', function () { return Inertia::render( 'PrivacyPolicyPage'); })->name('privacyPolicy');

// Products
Route::get('/products', function () { 
    return Inertia::render('ProductCategoriesPage'); 
})->name('products.index');

Route::get('/products/{categorySlug}', function ($categorySlug) { 
    return Inertia::render('ProductCategoryDetailPage', [
        'categorySlug' => $categorySlug,
    ]); 
})->name('products.category');

Route::get('/products/{categorySlug}/{productSlug}', function ($categorySlug, $productSlug) { 
    return Inertia::render('ProductDetailPage', [
        'categorySlug' => $categorySlug,
        'productSlug' => $productSlug,
    ]); 
})->name('products.detail');
