<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Site Lock
    |--------------------------------------------------------------------------
    |
    | Temporary gate for preview/staging access. When enabled, visitors must
    | enter the configured password before any storefront page is served.
    | Set SITE_LOCK_ENABLED=false to disable entirely.
    |
    */

    'enabled' => (bool) env('SITE_LOCK_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Access Password
    |--------------------------------------------------------------------------
    |
    | Plain text or bcrypt hash ($2y$...). Generate a hash with:
    | php artisan site-lock:hash-password "your-password"
    |
    */

    'password' => env('SITE_LOCK_PASSWORD'),

    /*
    |--------------------------------------------------------------------------
    | Bypass For Authenticated Admins
    |--------------------------------------------------------------------------
    |
    | When true, logged-in admin users can access the site without the lock
    | password. Useful while sharing the storefront with external reviewers.
    |
    */

    'bypass_admin' => (bool) env('SITE_LOCK_BYPASS_ADMIN', true),

    /*
    |--------------------------------------------------------------------------
    | Session Key
    |--------------------------------------------------------------------------
    */

    'session_key' => 'site_lock_token',

];
