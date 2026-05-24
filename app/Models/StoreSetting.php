<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class StoreSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'store_name',
        'contact_email',
        'contact_phone',
        'default_product_status',
        'invoice_due_days',
        'invoice_default_notes',
        'invoice_payment_instructions',
    ];

    public static function current(): self
    {
        return self::query()->firstOrCreate([], [
            'default_product_status' => 'draft',
            'invoice_due_days' => 14,
        ]);
    }

    public function displayName(): string
    {
        $name = trim((string) ($this->store_name ?? ''));

        return $name !== '' ? $name : (string) config('app.name');
    }

    public function defaultInvoiceDueDate(): Carbon
    {
        $days = max(1, (int) ($this->invoice_due_days ?? 14));

        return Carbon::now()->addDays($days);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'invoice_due_days' => 'integer',
        ];
    }
}
