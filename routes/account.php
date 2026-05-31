<?php

use App\Http\Controllers\Account\OrderHistoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('account')->name('account.')->group(function () {
    Route::get('orders', [OrderHistoryController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderHistoryController::class, 'show'])->name('orders.show');
});
