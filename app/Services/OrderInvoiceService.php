<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Validation\ValidationException;

class OrderInvoiceService
{
    public function __construct(
        private InvoiceFromOrderGenerator $generator,
        private InvoiceSender $sender,
    ) {}

    /**
     * @return array{invoice: Invoice, created: bool}
     */
    public function createOrGet(
        Order $order,
        bool $send = false,
        ?string $recipientEmail = null,
        ?string $message = null,
    ): array {
        $order->loadCount('items');

        if ($order->items_count === 0) {
            throw ValidationException::withMessages([
                'order' => 'Cannot create an invoice for an order with no line items.',
            ]);
        }

        $existing = $this->activeInvoiceFor($order);
        $created = $existing === null;

        $invoice = $existing ?? $this->generator->create($order);

        if ($send) {
            $this->sender->send(
                $invoice,
                $recipientEmail ?? $invoice->customer_email,
                $message,
            );
        }

        return [
            'invoice' => $invoice->fresh(['items', 'order:id,order_number']),
            'created' => $created,
        ];
    }

    private function activeInvoiceFor(Order $order): ?Invoice
    {
        return $order->invoices()
            ->whereNot('status', InvoiceStatus::Void)
            ->latest()
            ->first();
    }
}
