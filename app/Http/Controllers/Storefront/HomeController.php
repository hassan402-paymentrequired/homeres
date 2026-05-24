<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Storefront\LandingCollectionsBuilder;
use App\Support\Storefront\StorefrontProductPresenter;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(
        StorefrontProductPresenter $presenter,
        LandingCollectionsBuilder $landingCollections,
    ): Response {
        
        $newArrivals = Product::query()
            ->published()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('created_at', '>=', now()->subDays(60))
            ->inRandomOrder()
            // ->ordered()
            ->limit(10)
            ->get();

        if ($newArrivals->isEmpty()) {
            $newArrivals = Product::query()
                ->published()
                ->with(['brand', 'category', 'images', 'variants'])
                ->inRandomOrder()
                // ->ordered()
                ->limit(10)
                ->get();
        }

        return Inertia::render('welcome', [
            'newArrivals' => $presenter->cards($newArrivals),
            'shopCollections' => $landingCollections->build(),
        ]);
    }
}
