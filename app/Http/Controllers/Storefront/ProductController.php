<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Storefront\StorefrontCatalogQuery;
use App\Support\Storefront\StorefrontProductPresenter;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $product, StorefrontProductPresenter $presenter, StorefrontCatalogQuery $catalog): Response
    {
        $model = Product::query()
            ->published()
            ->where(function ($query) use ($product): void {
                $query->where('id', $product)->orWhere('handle', $product);
            })
            ->firstOrFail();

        $related = Product::query()
            ->published()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('category_id', $model->category_id)
            ->where('id', '!=', $model->id)
            ->ordered()
            ->limit(4)
            ->get();

        return Inertia::render('product/show', [
            'product' => $presenter->detail($model),
            'relatedProducts' => $presenter->cards($related),
        ]);
    }
}
