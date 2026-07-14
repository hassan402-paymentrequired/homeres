<?php

namespace App\Http\Middleware;

use App\Services\Storefront\OpenAiChatService;
use App\Support\SiteLock;
use App\Support\Storefront\NewsletterPromptResolver;
use App\Support\Storefront\StorefrontCurrencyResolver;
use App\Support\Storefront\StorefrontNavigationBuilder;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $siteLock = app(SiteLock::class);
        $isStorefrontExcluded = $request->is('admin', 'admin/*', 'site-unlock');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'storefrontNav' => $isStorefrontExcluded
                ? []
                : app(StorefrontNavigationBuilder::class)->build(),
            'storefrontCurrency' => $isStorefrontExcluded
                ? null
                : app(StorefrontCurrencyResolver::class)->resolve($request)->toArray(),
            'showNewsletterModal' => $isStorefrontExcluded
                ? false
                : app(NewsletterPromptResolver::class)->shouldShow($request),
            'aiChatEnabled' => $isStorefrontExcluded
                ? false
                : OpenAiChatService::isConfigured(),
            'siteLock' => [
                'enabled' => $siteLock->isEnabled(),
                'unlocked' => ! $siteLock->isEnabled() || $siteLock->hasAccess($request),
            ],
            'auth' => [
                'user' => $request->user(),
                'admin' => $request->user('admin'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
                'importResult' => $request->session()->get('importResult'),
                'showWelcome' => (bool) $request->session()->get('showWelcome'),
            ],
        ];
    }
}
