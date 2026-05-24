<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CheckoutService;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaystackWebhookController extends Controller
{
    public function __invoke(Request $request, PaystackService $paystack, CheckoutService $checkout): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('x-paystack-signature');

        if (! $paystack->verifyWebhookSignature($payload, $signature)) {
            return response('Invalid signature', 400);
        }

        /** @var array{event?: string, data?: array<string, mixed>} $body */
        $body = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);

        if (($body['event'] ?? '') !== 'charge.success') {
            return response('Ignored', 200);
        }

        $reference = (string) ($body['data']['reference'] ?? '');
        $orderId = (string) ($body['data']['metadata']['order_id'] ?? '');
        $order = Order::query()->find($orderId);

        if ($order === null || $reference === '') {
            return response('Order not found', 404);
        }

        $checkout->markPaid(
            $order,
            $reference,
            isset($body['data']['id']) ? (string) $body['data']['id'] : null,
        );

        return response('OK', 200);
    }
}
