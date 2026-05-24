<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\ShopIndexRequest;
use App\Services\Storefront\ShopPageService;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function __invoke(ShopIndexRequest $request, ShopPageService $shopPage): Response
    {
        return Inertia::render('catalog/index', $shopPage->build($request));
    }
}
