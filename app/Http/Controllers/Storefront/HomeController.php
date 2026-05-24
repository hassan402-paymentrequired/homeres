<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Storefront\StorefrontProductPresenter;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(StorefrontProductPresenter $presenter): Response
    {
        $newArrivals = Product::query()
            ->published()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('created_at', '>=', now()->subDays(60))
            ->ordered()
            ->limit(8)
            ->get();

        if ($newArrivals->isEmpty()) {
            $newArrivals = Product::query()
                ->published()
                ->with(['brand', 'category', 'images', 'variants'])
                ->ordered()
                ->limit(8)
                ->get();
        }

        return Inertia::render('welcome', [
            'newArrivals' => $presenter->cards($newArrivals),
        ]);
    }
}
