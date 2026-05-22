<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::inertia('categories', 'admin/modules/placeholder', ['title' => 'Categories'])
            ->name('categories.index');
        Route::inertia('brands', 'admin/modules/placeholder', ['title' => 'Brands'])
            ->name('brands.index');
        Route::inertia('products', 'admin/modules/placeholder', ['title' => 'Products'])
            ->name('products.index');
        Route::inertia('orders', 'admin/modules/placeholder', ['title' => 'Orders'])
            ->name('orders.index');
        Route::inertia('invoices', 'admin/modules/placeholder', ['title' => 'Invoices'])
            ->name('invoices.index');
        Route::inertia('analytics', 'admin/modules/placeholder', ['title' => 'Analytics'])
            ->name('analytics.index');
        Route::inertia('settings', 'admin/modules/placeholder', ['title' => 'Settings'])
            ->name('settings.index');
    });
});
