<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Support\Storefront\StorefrontCatalogQuery;
use App\Support\Storefront\StorefrontProductPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request, StorefrontCatalogQuery $catalog, StorefrontProductPresenter $presenter): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));

        if ($query === '') {
            return response()->json(['products' => []]);
        }

        $products = $catalog->build(['q' => $query])->limit(24)->get();

        return response()->json([
            'products' => $presenter->cards($products),
        ]);
    }
}
