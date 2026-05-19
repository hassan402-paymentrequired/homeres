<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/about', 'about/index')->name('about');
Route::inertia('/services', 'services/index')->name('services');
Route::inertia('/contact', 'contact/index')->name('contact');

Route::inertia('/help', 'help/index')->name('help');
Route::get('/help/{slug}', function (string $slug) {
    return Inertia::render('help/show', ['slug' => $slug]);
})->name('help.show');

Route::inertia('/wishlist', 'wishlist/index')->name('wishlist');

Route::get('/shop/new-arrivals', fn () => Inertia::render('catalog/index', [
    'filter' => 'new',
]))->name('shop.new');

Route::get('/shop/{category}', function (string $category, Request $request) {
    return Inertia::render('catalog/index', [
        'category' => $category,
        'sub' => $request->query('sub'),
        'q' => $request->query('q'),
    ]);
})->name('shop.category');

Route::get('/shop', function (Request $request) {
    return Inertia::render('catalog/index', [
        'q' => $request->query('q'),
    ]);
})->name('shop');

Route::get('/products/{id}', fn (string $id) => Inertia::render('product/show', [
    'id' => $id,
]))->name('products.show');

Route::inertia('/checkout', 'checkout/index')->name('checkout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
