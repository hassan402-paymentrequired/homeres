<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Storefront\StorefrontProductPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductLookupController extends Controller
{
    public function __invoke(Request $request, StorefrontProductPresenter $presenter): JsonResponse
    {
        $ids = collect($request->input('ids', []))
            ->filter(fn ($id): bool => is_string($id) && $id !== '')
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return response()->json(['products' => []]);
        }

        $products = Product::query()
            ->published()
            ->with(['brand', 'category', 'images', 'variants'])
            ->whereIn('id', $ids)
            ->get();

        return response()->json([
            'products' => $presenter->cards($products),
        ]);
    }
}
