<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreSetting;
use Carbon\CarbonInterface;

class InvoiceFromOrderGenerator
{
    public function __construct(
        private InvoiceNumberGenerator $numberGenerator,
    ) {}

    public function create(
        Order $order,
        InvoiceStatus $status = InvoiceStatus::Draft,
        ?CarbonInterface $issuedAt = null,
        ?CarbonInterface $dueAt = null,
    ): Invoice {
        $order->loadMissing('items');
        $settings = StoreSetting::current();

        $issuedAt ??= now();
        $dueAt ??= $settings->defaultInvoiceDueDate();

        $customerNote = $order->customer_note;
        if (! filled($customerNote) && filled($settings->invoice_default_notes)) {
            $customerNote = $settings->invoice_default_notes;
        }

        $invoice = Invoice::query()->create([
            'invoice_number' => $this->numberGenerator->generate($issuedAt),
            'order_id' => $order->id,
            'status' => $status,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'billing_address' => $order->shipping_address,
            'billing_city' => $order->shipping_city,
            'billing_state' => $order->shipping_state,
            'customer_note' => $customerNote,
            'admin_note' => null,
            'subtotal' => $order->subtotal,
            'discount' => 0,
            'tax' => 0,
            'shipping_total' => $order->shipping_total,
            'total' => $order->total,
            'has_price_on_request_items' => $order->has_price_on_request_items,
            'currency' => $order->currency,
            'issued_at' => $status === InvoiceStatus::Draft ? null : $issuedAt,
            'due_at' => $dueAt,
            'paid_at' => $status === InvoiceStatus::Paid ? $issuedAt : null,
        ]);

        foreach ($order->items as $index => $item) {
            $invoice->items()->create($this->itemAttributes($item, $index + 1));
        }

        return $invoice->load('items');
    }

    /**
     * @return array<string, mixed>
     */
    private function itemAttributes(OrderItem $item, int $sortOrder): array
    {
        return [
            'order_item_id' => $item->id,
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'sku' => $item->sku,
            'unit_price' => $item->unit_price,
            'price_on_request' => $item->price_on_request,
            'quantity' => $item->quantity,
            'line_total' => $item->line_total,
            'sort_order' => $sortOrder,
        ];
    }
}
