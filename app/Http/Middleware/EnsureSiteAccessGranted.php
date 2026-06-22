<?php

namespace App\Http\Middleware;

use App\Support\SiteLock;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSiteAccessGranted
{
    public function __construct(private SiteLock $siteLock) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->siteLock->shouldBypass($request) || $this->siteLock->hasAccess($request)) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Site access required.'], 403);
        }

        return redirect()->guest(route('site-lock.show'));
    }
}
