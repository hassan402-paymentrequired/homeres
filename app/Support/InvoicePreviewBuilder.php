<?php

namespace App\Support;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\StoreSetting;

final class InvoicePreviewBuilder
{
    /**
     * @return array<string, mixed>
     */
    public static function fromInvoice(Invoice $invoice): array
    {
        $invoice->loadMissing('items', 'order:id,order_number');
        $settings = StoreSetting::current();

        $lines = $invoice->items->map(function (InvoiceItem $item): array {
            $description = trim($item->product_name.(
                $item->variant_name !== '' && $item->variant_name !== '—'
                    ? ' — '.$item->variant_name
                    : ''
            ));

            return [
                'description' => $description,
                'quantity' => (string) $item->quantity,
                'unit_price_display' => InvoiceMoney::format(
                    $item->unit_price !== null ? (float) $item->unit_price : null,
                    $item->price_on_request,
                ),
                'line_total_display' => InvoiceMoney::format(
                    $item->line_total !== null ? (float) $item->line_total : null,
                    $item->price_on_request,
                ),
            ];
        })->values()->all();

        $billingAddress = collect([
            $invoice->billing_address,
            collect([$invoice->billing_city, $invoice->billing_state])->filter()->join(', '),
        ])->filter()->join("\n");

        return [
            'invoice_number' => $invoice->invoice_number,
            'store_name' => $settings->displayName(),
            'order_number' => $invoice->order?->order_number,
            'customer_name' => $invoice->customer_name,
            'customer_email' => $invoice->customer_email ?: null,
            'billing_address' => $billingAddress !== '' ? $billingAddress : null,
            'due_date' => $invoice->due_at?->format('j F Y'),
            'lines' => $lines,
            'subtotal_display' => InvoiceMoney::format(
                $invoice->subtotal !== null ? (float) $invoice->subtotal : null,
                $invoice->has_price_on_request_items,
            ),
            'discount_display' => InvoiceMoney::format((float) ($invoice->discount ?? 0)),
            'tax_display' => InvoiceMoney::format((float) ($invoice->tax ?? 0)),
            'shipping_display' => InvoiceMoney::format(
                $invoice->shipping_total !== null ? (float) $invoice->shipping_total : null,
            ),
            'total_display' => InvoiceMoney::format(
                $invoice->total !== null ? (float) $invoice->total : null,
                $invoice->has_price_on_request_items,
            ),
            'customer_note' => $invoice->customer_note,
            'payment_instructions' => $settings->invoice_payment_instructions,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function paymentDefaults(): array
    {
        $settings = StoreSetting::current();

        return [
            'payment_instructions' => $settings->invoice_payment_instructions,
        ];
    }
}
