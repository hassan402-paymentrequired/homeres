<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Support\Storefront\StorefrontCurrencyResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StorefrontCurrencyController extends Controller
{
    public function update(Request $request, StorefrontCurrencyResolver $resolver): RedirectResponse
    {
        $validated = $request->validate([
            'currency' => ['required', 'in:NGN,USD'],
        ]);

        $resolver->setPreference($request, $validated['currency']);

        return back();
    }
}
