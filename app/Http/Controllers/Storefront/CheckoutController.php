<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreCheckoutRequest;
use App\Models\Order;
use App\Services\CheckoutService;
use App\Services\PaystackService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('checkout/index', [
            'paystackPublicKey' => config('paystack.public_key'),
            'paystackConfigured' => app(PaystackService::class)->isConfigured(),
        ]);
    }

    public function store(
        StoreCheckoutRequest $request,
        CheckoutService $checkout,
        PaystackService $paystack,
    ): RedirectResponse {
        $order = $checkout->place($request->validated());

        if ($order->payment_status === PaymentStatus::NotRequired) {
            return redirect()
                ->route('checkout.complete', $order)
                ->with('success', 'Thank you. We will contact you with pricing and next steps.');
        }

        if (! $paystack->isConfigured()) {
            return redirect()
                ->route('checkout.complete', $order)
                ->with('warning', 'Order received. Online payment is not configured yet — our team will follow up.');
        }

        $payment = $paystack->initialize($order);
        $order->update(['paystack_reference' => $payment['reference']]);

        return Inertia::location($payment['authorization_url']);
    }

    public function callback(Request $request, CheckoutService $checkout, PaystackService $paystack): RedirectResponse
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
                'has_price_on_request_items' => $order->has_price_on_request_items,
            ],
        ]);
    }
}
