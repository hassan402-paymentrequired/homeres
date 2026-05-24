<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\StoreSetting;
use App\Support\InvoiceMoney;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
        public ?string $personalMessage = null,
    ) {}

    public function envelope(): Envelope
    {
        $storeName = config('app.name');

        return new Envelope(
            subject: "Invoice {$this->invoice->invoice_number} — {$storeName}",
        );
    }

    public function content(): Content
    {
        $settings = StoreSetting::current();

        return new Content(
            markdown: 'mail.invoice',
            with: [
                'invoiceData' => InvoiceMoney::present($this->invoice),
                'personalMessage' => $this->personalMessage,
                'storeName' => config('app.name'),
                'contactEmail' => $settings->contact_email,
                'contactPhone' => $settings->contact_phone,
            ],
        );
    }
}
