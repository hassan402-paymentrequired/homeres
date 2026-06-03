<?php

use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\PaystackWebhookController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\ProductLookupController;
use App\Http\Controllers\Storefront\SearchController;
use App\Http\Controllers\Storefront\ShopController;
use App\Http\Controllers\Storefront\StorefrontCurrencyController;
use App\Http\Controllers\Storefront\StripeWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::inertia('/about', 'about/index')->name('about');
Route::inertia('/services', 'services/index')->name('services');
Route::inertia('/contact', 'contact/index')->name('contact');

Route::inertia('/help', 'help/index')->name('help');
Route::get('/help/{slug}', function (string $slug) {
    return Inertia::render('help/show', ['slug' => $slug]);
})->name('help.show');

Route::inertia('/wishlist', 'wishlist/index')->name('wishlist');

Route::get('/shop/new-arrivals', ShopController::class)->name('shop.new');

Route::get('/shop/{category}', ShopController::class)->name('shop.category');

Route::get('/shop', ShopController::class)->name('shop');

Route::get('/collections/{handle}', ShopController::class)->name('collections.show');

Route::get('/brands/{handle}', ShopController::class)->name('brands.show');

Route::get('/brands', ShopController::class)->name('brands');

Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::post('/storefront/products/lookup', ProductLookupController::class)->name('storefront.products.lookup');
Route::get('/storefront/search', SearchController::class)->name('storefront.search');
Route::post('/storefront/currency', [StorefrontCurrencyController::class, 'update'])->name('storefront.currency');

Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/callback', [CheckoutController::class, 'callback'])->name('checkout.callback');
Route::get('/checkout/stripe/callback', [CheckoutController::class, 'stripeCallback'])->name('checkout.stripe.callback');
Route::get('/checkout/complete/{order}', [CheckoutController::class, 'complete'])->name('checkout.complete');

Route::post('/paystack/webhook', PaystackWebhookController::class)->name('paystack.webhook');
Route::post('/stripe/webhook', StripeWebhookController::class)->name('stripe.webhook');

require __DIR__.'/settings.php';
require __DIR__.'/account.php';
