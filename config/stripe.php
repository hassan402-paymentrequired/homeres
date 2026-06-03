<?php

return [
    'secret_key' => env('STRIPE_SECRET_KEY'),
    'public_key' => env('STRIPE_PUBLIC_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    'base_url' => env('STRIPE_BASE_URL', 'https://api.stripe.com/v1'),
];
