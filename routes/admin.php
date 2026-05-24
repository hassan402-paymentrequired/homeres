<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\OrderInvoiceController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductTemplateController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('categories', CategoryController::class);
        Route::resource('brands', BrandController::class);
        Route::resource('products', ProductController::class);
        Route::resource('product-templates', ProductTemplateController::class);
        Route::resource('products.variants', ProductVariantController::class)->except(['index', 'show']);
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
        Route::post('orders/{order}/invoice', [OrderInvoiceController::class, 'store'])
            ->name('orders.invoice.store');
        Route::resource('invoices', InvoiceController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
        Route::put('invoices/{invoice}/compose', [InvoiceController::class, 'updateCompose'])
            ->name('invoices.compose.update');
        Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send'])
            ->name('invoices.send');
        Route::get('analytics', AnalyticsController::class)->name('analytics.index');
        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});
