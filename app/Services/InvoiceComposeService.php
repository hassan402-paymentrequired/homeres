<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Order;
use App\Models\StoreSetting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InvoiceComposeService
{
    public function __construct(
        private InvoiceNumberGenerator $numberGenerator,
        private InvoiceSender $sender,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Invoice
    {
        $settings = StoreSetting::current();

        return DB::transaction(function () use ($data, $settings): Invoice {
            $totals = $this->calculateTotals($data['items'], $data);

            $invoice = Invoice::query()->create([
                'invoice_number' => $data['invoice_number'],
                'order_id' => $data['order_id'] ?? null,
                'status' => InvoiceStatus::Draft,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? '',
                'customer_phone' => $data['customer_phone'] ?? null,
                'billing_address' => $data['billing_address'] ?? null,
                'billing_city' => $data['billing_city'] ?? null,
                'billing_state' => $data['billing_state'] ?? null,
                'customer_note' => $data['customer_note'] ?? null,
                'subtotal' => $totals['subtotal'],
                'discount' => $totals['discount'],
                'tax' => $totals['tax'],
                'shipping_total' => 0,
                'total' => $totals['total'],
                'has_price_on_request_items' => false,
                'currency' => 'NGN',
                'issued_at' => null,
                'due_at' => isset($data['due_date'])
                    ? Carbon::parse($data['due_date'])
                    : $settings->defaultInvoiceDueDate(),
                'paid_at' => null,
            ]);

            $this->syncItems($invoice, $data['items']);

            return $this->finalizeIntent($invoice, $data['intent'], $data['customer_email'] ?? null);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Invoice $invoice, array $data): Invoice
    {
        return DB::transaction(function () use ($invoice, $data): Invoice {
            $totals = $this->calculateTotals($data['items'], $data);

            $invoice->update([
                'invoice_number' => $data['invoice_number'],
                'order_id' => $data['order_id'] ?? null,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? '',
                'customer_phone' => $data['customer_phone'] ?? null,
                'billing_address' => $data['billing_address'] ?? null,
                'billing_city' => $data['billing_city'] ?? null,
                'billing_state' => $data['billing_state'] ?? null,
                'customer_note' => $data['customer_note'] ?? null,
                'subtotal' => $totals['subtotal'],
                'discount' => $totals['discount'],
                'tax' => $totals['tax'],
                'shipping_total' => 0,
                'total' => $totals['total'],
                'has_price_on_request_items' => false,
                'due_at' => isset($data['due_date']) ? Carbon::parse($data['due_date']) : $invoice->due_at,
            ]);

            $invoice->items()->delete();
            $this->syncItems($invoice, $data['items']);

            return $this->finalizeIntent($invoice->fresh(), $data['intent'], $data['customer_email'] ?? null);
        });
    }

    public function suggestedNumber(?Order $order = null): string
    {
        if ($order !== null) {
            return 'REF-'.$order->order_number;
        }

        return $this->numberGenerator->generate();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function prefillFromOrder(Order $order): array
    {
        $order->loadMissing('items');
        $settings = StoreSetting::current();

        $address = collect([
            $order->shipping_address,
            trim(collect([$order->shipping_city, $order->shipping_state])->filter()->join(', ')),
        ])->filter()->join("\n");

        $customerNote = $order->customer_note;
        if (! filled($customerNote) && filled($settings->invoice_default_notes)) {
            $customerNote = $settings->invoice_default_notes;
        }

        return [
            'order_id' => $order->id,
            'invoice_number' => $this->suggestedNumber($order),
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'billing_address' => $address !== '' ? $address : null,
            'billing_city' => null,
            'billing_state' => null,
            'due_date' => $settings->defaultInvoiceDueDate()->toDateString(),
            'discount' => 0,
            'tax' => 0,
            'customer_note' => $customerNote,
            'lines' => $order->items->map(fn ($item): array => [
                'description' => trim($item->product_name.($item->variant_name !== 'Default' ? ' — '.$item->variant_name : '')),
                'quantity' => (string) $item->quantity,
                'unit_price' => $item->price_on_request || $item->unit_price === null
                    ? 0
                    : (float) $item->unit_price,
            ])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function prefillFromInvoice(Invoice $source): array
    {
        $source->loadMissing('items');

        return [
            'order_id' => null,
            'invoice_number' => $this->suggestedNumber(),
            'customer_name' => $source->customer_name,
            'customer_email' => $source->customer_email,
            'customer_phone' => $source->customer_phone,
            'billing_address' => $source->billing_address,
            'billing_city' => $source->billing_city,
            'billing_state' => $source->billing_state,
            'due_date' => $source->due_at?->toDateString(),
            'discount' => (float) ($source->discount ?? 0),
            'tax' => (float) ($source->tax ?? 0),
            'customer_note' => $source->customer_note,
            'lines' => $source->items->map(fn (InvoiceItem $item): array => [
                'description' => trim($item->product_name.($item->variant_name !== '' && $item->variant_name !== '—' ? ' — '.$item->variant_name : '')),
                'quantity' => (string) $item->quantity,
                'unit_price' => $item->price_on_request || $item->unit_price === null
                    ? 0
                    : (float) $item->unit_price,
            ])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function editPayload(Invoice $invoice): array
    {
        $invoice->loadMissing('items');

        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'order_id' => $invoice->order_id,
            'customer_name' => $invoice->customer_name,
            'customer_email' => $invoice->customer_email,
            'customer_phone' => $invoice->customer_phone,
            'billing_address' => $invoice->billing_address,
            'billing_city' => $invoice->billing_city,
            'billing_state' => $invoice->billing_state,
            'due_date' => $invoice->due_at?->toDateString(),
            'discount' => (float) ($invoice->discount ?? 0),
            'tax' => (float) ($invoice->tax ?? 0),
            'customer_note' => $invoice->customer_note,
            'lines' => $invoice->items->map(fn (InvoiceItem $item): array => [
                'description' => trim($item->product_name.($item->variant_name !== '' && $item->variant_name !== '—' ? ' — '.$item->variant_name : '')),
                'quantity' => (string) $item->quantity,
                'unit_price' => $item->price_on_request || $item->unit_price === null
                    ? 0
                    : (float) $item->unit_price,
            ])->values()->all(),
        ];
    }

    /**
     * @param  array<int, array{description: string, quantity: float|string, unit_price: float|string}>  $items
     * @param  array<string, mixed>  $data
     * @return array{subtotal: float, discount: float, tax: float, total: float}
     */
    private function calculateTotals(array $items, array $data): array
    {
        $subtotal = 0.0;

        foreach ($items as $row) {
            $qty = (float) $row['quantity'];
            $unit = (float) $row['unit_price'];
            $subtotal += round($qty * $unit, 2);
        }

        $discount = round((float) ($data['discount'] ?? 0), 2);
        $tax = round((float) ($data['tax'] ?? 0), 2);
        $total = max(0, round($subtotal - $discount + $tax, 2));

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
        ];
    }

    /**
     * @param  array<int, array{description: string, quantity: float|string, unit_price: float|string}>  $items
     */
    private function syncItems(Invoice $invoice, array $items): void
    {
        foreach ($items as $index => $row) {
            $qty = (float) $row['quantity'];
            $unit = round((float) $row['unit_price'], 2);
            $lineTotal = round($qty * $unit, 2);

            $invoice->items()->create([
                'order_item_id' => null,
                'product_name' => $row['description'],
                'variant_name' => '—',
                'sku' => null,
                'unit_price' => $unit,
                'price_on_request' => false,
                'quantity' => (int) max(1, round($qty)),
                'line_total' => $lineTotal,
                'sort_order' => $index + 1,
            ]);
        }
    }

    private function finalizeIntent(Invoice $invoice, string $intent, ?string $email): Invoice
    {
        if ($intent === 'send') {
            $recipient = $email !== null && $email !== '' ? $email : $invoice->customer_email;

            if ($recipient === '') {
                throw ValidationException::withMessages([
                    'customer_email' => 'An email address is required to send the invoice.',
                ]);
            }

            $this->sender->send($invoice, $recipient);

            return $invoice->fresh(['items', 'order:id,order_number']);
        }

        $invoice->update(['status' => InvoiceStatus::Draft]);

        return $invoice->fresh(['items', 'order:id,order_number']);
    }
}
