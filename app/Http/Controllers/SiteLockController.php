<?php

namespace App\Http\Controllers;

use App\Http\Requests\UnlockSiteRequest;
use App\Support\SiteLock;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteLockController extends Controller
{
    public function show(SiteLock $siteLock): Response|RedirectResponse
    {
        if (! $siteLock->isEnabled()) {
            return redirect()->route('home');
        }

        return Inertia::render('site-unlock');
    }

    public function store(UnlockSiteRequest $request, SiteLock $siteLock): RedirectResponse
    {
        if (! $siteLock->isEnabled()) {
            return redirect()->route('home');
        }

        $request->unlock($siteLock);

        return redirect()->intended(route('home'));
    }
}
