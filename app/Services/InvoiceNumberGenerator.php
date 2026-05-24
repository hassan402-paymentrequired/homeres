<?php

namespace App\Services;

use App\Models\Invoice;
use Carbon\CarbonInterface;

class InvoiceNumberGenerator
{
    public function generate(?CarbonInterface $issuedAt = null): string
    {
        $issuedAt ??= now();
        $datePrefix = $issuedAt->format('Ymd');
        $prefix = "INV-{$datePrefix}-";

        $latestSequence = Invoice::query()
            ->where('invoice_number', 'like', "{$prefix}%")
            ->orderByDesc('invoice_number')
            ->value('invoice_number');

        $nextSequence = 1;

        if (is_string($latestSequence)) {
            $nextSequence = ((int) substr($latestSequence, -4)) + 1;
        }

        return sprintf('%s%04d', $prefix, $nextSequence);
    }
}
