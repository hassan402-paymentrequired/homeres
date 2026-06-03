<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CheckoutService;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, StripeService $stripe, CheckoutService $checkout): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        if (! $stripe->verifyWebhookSignature($payload, $signature)) {
            return response('Invalid signature', 400);
        }

        /** @var array{type?: string, data?: array{object?: array<string, mixed>}} $body */
        $body = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);

        if (($body['type'] ?? '') !== 'checkout.session.completed') {
            return response('Ignored', 200);
        }

        $session = $body['data']['object'] ?? [];
        $orderId = (string) ($session['metadata']['order_id'] ?? '');
        $order = Order::query()->find($orderId);

        if ($order === null || ($session['payment_status'] ?? '') !== 'paid') {
            return response('Order not found', 404);
        }

        $checkout->markPaidFromStripe(
            $order,
            (string) ($session['id'] ?? ''),
            isset($session['payment_intent']) ? (string) $session['payment_intent'] : null,
        );

        return response('OK', 200);
    }
}
