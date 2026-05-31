<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\StoreSetting;
use App\Support\InvoiceMoney;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice,
        public ?string $personalMessage = null,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $settings = StoreSetting::current();
        $this->invoice->loadMissing('items');

        return (new MailMessage)
            ->subject("Invoice {$this->invoice->invoice_number} — ".config('app.name'))
            ->view('mail.invoice', [
                'invoiceData' => InvoiceMoney::present($this->invoice),
                'personalMessage' => $this->personalMessage,
                'storeName' => config('app.name'),
                'contactEmail' => $settings->contact_email,
                'contactPhone' => $settings->contact_phone,
            ]);
    }
}
