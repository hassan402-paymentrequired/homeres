<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrderInvoiceRequest;
use App\Models\Order;
use App\Services\OrderInvoiceService;
use Illuminate\Http\RedirectResponse;

class OrderInvoiceController extends Controller
{
    public function store(
        StoreOrderInvoiceRequest $request,
        Order $order,
        OrderInvoiceService $orderInvoiceService,
    ): RedirectResponse {
        $validated = $request->validated();
        $send = $request->boolean('send');
        $recipientEmail = $validated['recipient_email'] ?? $order->customer_email;

        $result = $orderInvoiceService->createOrGet(
            $order,
            send: $send,
            recipientEmail: $validated['recipient_email'] ?? null,
            message: $validated['message'] ?? null,
        );

        $message = match (true) {
            $result['created'] && $send => "Invoice created and sent to {$recipientEmail}.",
            $result['created'] => 'Invoice created.',
            $send => "Invoice sent to {$recipientEmail}.",
            default => 'An invoice already exists for this order.',
        };

        return redirect()
            ->route('admin.invoices.show', $result['invoice'])
            ->with('success', $message);
    }
}
