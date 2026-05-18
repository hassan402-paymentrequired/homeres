<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/about', 'about/index')->name('about');
Route::inertia('/services', 'services/index')->name('services');
Route::inertia('/contact', 'contact/index')->name('contact');

Route::get('/shop/new-arrivals', fn () => Inertia::render('catalog/index', [
    'filter' => 'new',
]))->name('shop.new');

Route::get('/shop/{category}', fn (string $category) => Inertia::render('catalog/index', [
    'category' => $category,
]))->name('shop.category');

Route::get('/shop', fn () => Inertia::render('catalog/index'))->name('shop');

Route::get('/products/{id}', fn (string $id) => Inertia::render('product/show', [
    'id' => $id,
]))->name('products.show');

Route::inertia('/checkout', 'checkout/index')->name('checkout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
