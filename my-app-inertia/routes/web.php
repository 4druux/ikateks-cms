<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'Auth/LoginPage')->name('login');
    Route::inertia('/register', 'Auth/RegisterPage')->name('register');
});

Route::get('/', function () { return Inertia::render('Users/HomePage'); })->name('home');
Route::get('/about', function () { return Inertia::render('Users/AboutPage'); })->name('about');
Route::get('/principals', function () { return Inertia::render('Users/PrincipalsPage'); })->name('principals');
Route::get('/customers', function () { return Inertia::render('Users/CustomersPage'); })->name('customer');
Route::get('/contact', function () { return Inertia::render('Users/ContactPage'); })->name('contact');
Route::get('/privacy-policy', function () { return Inertia::render( 'Users/PrivacyPolicyPage'); })->name('privacyPolicy');

Route::prefix('news')->name('news.')->group(function () {
    Route::get('/', function () { 
        return Inertia::render('Users/NewsPage'); 
    })->name('index');

    Route::get('/{slug}', function ($slug) {
        return Inertia::render('Users/NewsPage', ['initialSlug' => $slug]);
    })->name('detail');
});

// Products
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', function () { 
        return Inertia::render('Users/ProductCategoriesPage'); 
    })->name('index');

    Route::get('/{categorySlug}', function ($categorySlug) { 
        return Inertia::render('Users/ProductCategoryDetailPage', ['categorySlug' => $categorySlug]); 
    })->name('category');

    Route::get('/{categorySlug}/{productSlug}', function ($categorySlug, $productSlug) { 
        return Inertia::render('Users/ProductDetailPage', ['categorySlug' => $categorySlug, 'productSlug' => $productSlug]); 
    })->name('detail');

    Route::get('/{categorySlug}/{productSlug}/{subProductSlug}', function ($categorySlug, $productSlug, $subProductSlug) { 
        return Inertia::render('Users/SubProductDetailPage', [
            'categorySlug' => $categorySlug, 
            'productSlug' => $productSlug,
            'subProductSlug' => $subProductSlug
        ]); 
    })->name('subproduct.detail');
});

Route::middleware(['auth', 'prevent.caching'])->group(function () {
    Route::inertia('/admin', 'Admin/HomePage')->name('home');

    Route::inertia('/admin/about', 'Admin/About/AboutPage')->name('about');
    Route::inertia('/admin/about/create', 'Admin/About/CreateAboutPage')->name('create.about');
    Route::get('/admin/about/edit/{id}', function ($id) {
        return Inertia::render('Admin/About/EditAboutPage', [
            'id' => (int) $id
        ]);
    })->name('edit.about');
    Route::get('/admin/about/{id}', function ($id) {
        return Inertia::render('Admin/About/AboutDetailPage', [
            'id' => (int) $id
        ]);
    })->name('show.about');

    Route::inertia('/admin/company-advantages/create', 'Admin/About/CreateAdvantagesPage')->name('create.advantages');
    Route::get('/admin/company-advantages/edit/{id}', function ($id) {
        return Inertia::render('Admin/About/EditAdvantagesPage', [
            'id' => (int) $id
        ]);
    })->name('edit.advantages');

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
    
    Route::get('/admin/categories/{categorySlug}/products/{productSlug}/subproducts/create', function ($categorySlug, $productSlug) {
        return Inertia::render('Admin/Products/CreateSubProductsPage', [
            'categorySlug' => $categorySlug,
            'productSlug' => $productSlug
        ]);
    })->name('subproducts.create');
    Route::get('/admin/categories/{categorySlug}/products/{productSlug}/subproducts/edit/{subProductSlug}', function ($categorySlug, $productSlug, $subProductSlug) {
        return Inertia::render('Admin/Products/EditSubProductsPage', [
            'categorySlug' => $categorySlug,
            'productSlug' => $productSlug,
            'slug' => $subProductSlug
        ]);
    })->name('subproducts.edit');
    Route::get('/admin/categories/{categorySlug}/products/{productSlug}/subproducts/{subProductSlug}', function ($categorySlug, $productSlug, $subProductSlug) {
        return Inertia::render('Admin/Products/SubProductDetailPage', [
            'categorySlug' => $categorySlug,
            'productSlug' => $productSlug,
            'slug' => $subProductSlug
        ]);
    })->name('subproducts.show');
    

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

    Route::inertia('/admin/principals', 'Admin/Principals/PrincipalsPage')->name('principals');
    Route::inertia('/admin/principals/create', 'Admin/Principals/CreatePrincipalsPage')->name('create.principals');
    Route::get('/admin/principals/edit/{id}', function ($id) {
        return Inertia::render('Admin/Principals/EditPrincipalsPage', [
            'id' => (int) $id
        ]);
    })->name('edit.principals');

    Route::inertia('/admin/customers', 'Admin/CustomersPage')->name('customers');

    Route::inertia('/admin/manage-account', 'Admin/ManageAccount/SelectAccount')->name('index');
    Route::inertia('/admin/manage-account/show', 'Admin/ManageAccount/ShowAccount')->name('show');


    Route::inertia('/admin/footer', 'Admin/SettingsPage')->name('index');

    Route::inertia('/admin/account-settings', 'Admin/AccountSettingsPage')->name('account.settings');

    Route::inertia('/admin/hero', 'Admin/Hero/HeroPage')->name('hero.index');
    Route::get('/admin/hero/{page_key}', function ($page_key) {
        return Inertia::render('Admin/Hero/EditHeroPage', [
            'page_key' => $page_key
        ]);
    })->name('hero.edit');
});
