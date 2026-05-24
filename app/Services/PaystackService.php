<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    /**
     * @return array{authorization_url: string, reference: string}
     */
    public function initialize(Order $order): array
    {
        $reference = 'HOM-'.Str::upper(Str::random(12));
        $amountKobo = (int) round(((float) $order->total) * 100);

        $response = Http::withToken((string) config('paystack.secret_key'))
            ->acceptJson()
            ->post($this->url('/transaction/initialize'), [
                'email' => $order->customer_email,
                'amount' => $amountKobo,
                'reference' => $reference,
                'currency' => 'NGN',
                'callback_url' => route('checkout.callback'),
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ])
            ->throw()
            ->json('data');

        return [
            'authorization_url' => (string) ($response['authorization_url'] ?? ''),
            'reference' => (string) ($response['reference'] ?? $reference),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function verify(string $reference): array
    {
        return Http::withToken((string) config('paystack.secret_key'))
            ->acceptJson()
            ->get($this->url('/transaction/verify/'.$reference))
            ->throw()
            ->json('data');
    }

    public function isConfigured(): bool
    {
        return filled(config('paystack.secret_key'));
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        if (! filled($signature) || ! $this->isConfigured()) {
            return false;
        }

        $computed = hash_hmac('sha512', $payload, (string) config('paystack.secret_key'));

        return hash_equals($computed, $signature);
    }

    private function url(string $path): string
    {
        return rtrim((string) config('paystack.base_url'), '/').$path;
    }
}
