<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreCheckoutRequest;
use App\Models\Order;
use App\Services\CheckoutService;
use App\Services\PaystackService;
use App\Services\StripeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(PaystackService $paystack, StripeService $stripe): Response
    {
        return Inertia::render('checkout/index', [
            'paystackConfigured' => $paystack->isConfigured(),
            'stripeConfigured' => $stripe->isConfigured(),
            'exchangeRates' => [
                'ngnToUsd' => (float) config('storefront.exchange_rates.NGN.USD', 0.00065),
                'usdToNgn' => (float) config('storefront.exchange_rates.USD.NGN', 1550),
            ],
        ]);
    }

    public function store(
        StoreCheckoutRequest $request,
        CheckoutService $checkout,
        PaystackService $paystack,
        StripeService $stripe,
    ): RedirectResponse|HttpResponse {
        $order = $checkout->place([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
        ]);

        if ($order->payment_status === PaymentStatus::NotRequired) {
            return redirect()
                ->route('checkout.complete', $order)
                ->with('success', 'Thank you. We will contact you with pricing and next steps.');
        }

        return match ($request->validated('payment_provider')) {
            'stripe' => $this->redirectToStripe($order, $stripe),
            default => $this->redirectToPaystack($order, $paystack),
        };
    }

    public function callback(Request $request, CheckoutService $checkout, PaystackService $paystack)
    {
        $reference = (string) $request->query('reference', '');

        if ($reference === '') {
            return redirect()->route('checkout')->with('error', 'Payment reference missing.');
        }

        $data = $paystack->verify($reference);
        $orderId = (string) ($data['metadata']['order_id'] ?? '');
        $order = Order::query()->findOrFail($orderId);

        if (($data['status'] ?? '') === 'success') {
            $checkout->markPaid(
                $order,
                $reference,
                isset($data['id']) ? (string) $data['id'] : null,
            );

            return redirect()
                ->route('checkout.complete', $order)
                ->with('success', 'Payment received. Thank you for your order.');
        }

        $order->update(['payment_status' => PaymentStatus::Failed]);

        return redirect()
            ->route('checkout.complete', $order)
            ->with('error', 'Payment was not completed. You can contact us to finish your order.');
    }

    public function stripeCallback(Request $request, CheckoutService $checkout, StripeService $stripe): RedirectResponse
    {
        $sessionId = (string) $request->query('session_id', '');

        if ($sessionId === '') {
            return redirect()->route('checkout')->with('error', 'Payment session missing.');
        }

        $session = $stripe->retrieveSession($sessionId);
        $orderId = (string) ($session['metadata']['order_id'] ?? '');
        $order = Order::query()->findOrFail($orderId);

        if (($session['payment_status'] ?? '') === 'paid') {
            $checkout->markPaidFromStripe(
                $order,
                $sessionId,
                isset($session['payment_intent']) ? (string) $session['payment_intent'] : null,
            );

            return redirect()
                ->route('checkout.complete', $order)
                ->with('success', 'Payment received. Thank you for your order.');
        }

        $order->update(['payment_status' => PaymentStatus::Failed]);

        return redirect()
            ->route('checkout.complete', $order)
            ->with('error', 'Payment was not completed. You can contact us to finish your order.');
    }

    public function complete(Order $order): Response
    {
        $order->loadMissing('items');

        return Inertia::render('checkout/complete', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'payment_status' => $order->payment_status->value,
                'customer_name' => $order->customer_name,
                'total' => $order->total !== null ? (float) $order->total : null,
                'currency' => $order->currency,
                'has_price_on_request_items' => $order->has_price_on_request_items,
            ],
        ]);
    }

    private function redirectToPaystack(Order $order, PaystackService $paystack): RedirectResponse|HttpResponse
    {
        if (! $paystack->isConfigured()) {
            return redirect()
                ->route('checkout.complete', $order)
                ->with('warning', 'Order received. Online payment is not configured yet — our team will follow up.');
        }

        $payment = $paystack->initialize($order);
        $order->update(['paystack_reference' => $payment['reference']]);

        return Inertia::location($payment['authorization_url']);
    }

    private function redirectToStripe(Order $order, StripeService $stripe): RedirectResponse|HttpResponse
    {
        if (! $stripe->isConfigured()) {
            return redirect()
                ->route('checkout.complete', $order)
                ->with('warning', 'Order received. Online payment is not configured yet — our team will follow up.');
        }

        $payment = $stripe->createCheckoutSession($order);
        $order->update(['stripe_session_id' => $payment['session_id']]);

        return Inertia::location($payment['url']);
    }
}
