<?php

namespace App\Support;

use App\Models\Invoice;

final class InvoiceMoney
{
    public static function format(?float $amount, bool $priceOnRequest = false): string
    {
        if ($priceOnRequest && $amount === null) {
            return 'Price on request';
        }

        if ($amount === null) {
            return '—';
        }

        return number_format($amount, 2, '.', ',');
    }

    /**
     * @return array<string, mixed>
     */
    public static function present(Invoice $invoice): array
    {
        return InvoicePreviewBuilder::fromInvoice($invoice);
    }
}
