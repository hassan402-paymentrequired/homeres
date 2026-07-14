<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SiteLock
{
    /**
     * Route name patterns that require the site password when the lock is enabled.
     *
     * @var list<string>
     */
    private const LOCKED_ROUTES = [
        'products.show',
        'shop',
        'shop.*',
        'collections.*',
        'brands',
        'brands.*',
        'wishlist',
        'storefront.search',
        'storefront.products.lookup',
        'checkout',
        'checkout.*',
    ];

    public function isEnabled(): bool
    {
        if (! config('site-lock.enabled')) {
            return false;
        }

        return filled(config('site-lock.password'));
    }

    public function protectsRoute(Request $request): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        return $request->routeIs(...self::LOCKED_ROUTES);
    }

    public function shouldBypass(Request $request): bool
    {
        if (! $this->isEnabled()) {
            return true;
        }

        if (! $this->protectsRoute($request)) {
            return true;
        }

        if ($request->routeIs('site-lock.*')) {
            return true;
        }

        if ($request->is('up', 'paystack/webhook', 'stripe/webhook')) {
            return true;
        }

        if (config('site-lock.bypass_admin') && $request->user('admin') !== null) {
            return true;
        }

        return false;
    }

    public function hasAccess(Request $request): bool
    {
        if (! $request->hasSession()) {
            return false;
        }

        $token = $request->session()->get(config('site-lock.session_key'));

        if (! is_string($token) || $token === '') {
            return false;
        }

        return hash_equals($token, $this->grantedToken());
    }

    public function grantAccess(Request $request): void
    {
        $request->session()->put(
            config('site-lock.session_key'),
            $this->grantedToken(),
        );
    }

    public function verifyPassword(string $password): bool
    {
        $configured = config('site-lock.password');

        if (! is_string($configured) || $configured === '') {
            return false;
        }

        if (str_starts_with($configured, '$2y$') || str_starts_with($configured, '$2a$')) {
            return Hash::check($password, $configured);
        }

        return hash_equals($configured, $password);
    }

    private function grantedToken(): string
    {
        return hash_hmac('sha256', 'site-lock-granted', (string) config('app.key'));
    }
}
