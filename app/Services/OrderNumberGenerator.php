<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Carbon;

class OrderNumberGenerator
{
    public function generate(?Carbon $placedAt = null): string
    {
        $placedAt ??= now();
        $datePrefix = $placedAt->format('Ymd');
        $prefix = "HOM-{$datePrefix}-";

        $latestSequence = Order::query()
            ->where('order_number', 'like', "{$prefix}%")
            ->orderByDesc('order_number')
            ->value('order_number');

        $nextSequence = 1;

        if (is_string($latestSequence)) {
            $nextSequence = ((int) substr($latestSequence, -4)) + 1;
        }

        return sprintf('%s%04d', $prefix, $nextSequence);
    }
}
