<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Mail\InvoiceMail;
use App\Models\Invoice;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class InvoiceSender
{
    public function send(Invoice $invoice, string $recipientEmail, ?string $message = null): void
    {
        if ($invoice->status === InvoiceStatus::Void) {
            throw ValidationException::withMessages([
                'invoice' => 'Void invoices cannot be sent.',
            ]);
        }

        $invoice->loadMissing('items');

        Mail::to($recipientEmail)->send(new InvoiceMail($invoice, $message));

        if ($invoice->status !== InvoiceStatus::Paid) {
            $updates = ['status' => InvoiceStatus::Sent];

            if ($invoice->issued_at === null) {
                $updates['issued_at'] = now();
            }

            if ($invoice->due_at === null) {
                $updates['due_at'] = now()->addDays(14);
            }

            $invoice->update($updates);
        }
    }
}
