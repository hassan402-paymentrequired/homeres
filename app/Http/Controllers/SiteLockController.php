<?php

namespace App\Http\Controllers;

use App\Http\Requests\UnlockSiteRequest;
use App\Support\SiteLock;
use Illuminate\Http\JsonResponse;
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

        if ($siteLock->hasAccess(request())) {
            return redirect()->intended(route('home'));
        }

        return Inertia::render('site-unlock');
    }

    public function store(UnlockSiteRequest $request, SiteLock $siteLock): JsonResponse|RedirectResponse
    {
        if (! $siteLock->isEnabled()) {
            if ($request->expectsJson()) {
                return response()->json(['unlocked' => true]);
            }

            return redirect()->route('home');
        }

        $request->unlock($siteLock);

        if ($request->expectsJson()) {
            return response()->json(['unlocked' => true]);
        }

        return redirect()
            ->intended(route('home'))
            ->with('showWelcome', true);
    }
}
