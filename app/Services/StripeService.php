<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;

class StripeService
{
    /**
     * @return array{url: string, session_id: string}
     */
    public function createCheckoutSession(Order $order): array
    {
        $amountCents = (int) round(((float) $order->total) * 100);

        $response = Http::withToken((string) config('stripe.secret_key'))
            ->asForm()
            ->post($this->url('/checkout/sessions'), [
                'mode' => 'payment',
                'customer_email' => $order->customer_email,
                'success_url' => route('checkout.stripe.callback').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.complete', $order),
                'line_items[0][price_data][currency]' => strtolower((string) $order->currency),
                'line_items[0][price_data][unit_amount]' => $amountCents,
                'line_items[0][price_data][product_data][name]' => 'Order '.$order->order_number,
                'line_items[0][quantity]' => 1,
                'metadata[order_id]' => $order->id,
                'metadata[order_number]' => $order->order_number,
            ])
            ->throw()
            ->json();

        return [
            'url' => (string) ($response['url'] ?? ''),
            'session_id' => (string) ($response['id'] ?? ''),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function retrieveSession(string $sessionId): array
    {
        return Http::withToken((string) config('stripe.secret_key'))
            ->acceptJson()
            ->get($this->url('/checkout/sessions/'.$sessionId))
            ->throw()
            ->json();
    }

    public function isConfigured(): bool
    {
        return filled(config('stripe.secret_key'));
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        $secret = (string) config('stripe.webhook_secret');

        if (! filled($signature) || ! filled($secret)) {
            return false;
        }

        $timestamp = null;
        $signatures = [];

        foreach (explode(',', $signature) as $element) {
            [$key, $value] = array_pad(explode('=', trim($element), 2), 2, null);

            if ($key === 't') {
                $timestamp = $value;
            }

            if ($key === 'v1' && is_string($value)) {
                $signatures[] = $value;
            }
        }

        if ($timestamp === null || $signatures === []) {
            return false;
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

        foreach ($signatures as $signatureValue) {
            if (hash_equals($expected, $signatureValue)) {
                return true;
            }
        }

        return false;
    }

    private function url(string $path): string
    {
        return rtrim((string) config('stripe.base_url'), '/').$path;
    }
}
