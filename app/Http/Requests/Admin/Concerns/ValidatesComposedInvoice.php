<?php

namespace App\Http\Requests\Admin\Concerns;

use Illuminate\Validation\Rule;

trait ValidatesComposedInvoice
{
    /**
     * @return array<string, mixed>
     */
    protected function composedInvoiceRules(?string $ignoreInvoiceId = null): array
    {
        $uniqueNumber = Rule::unique('invoices', 'invoice_number');

        if ($ignoreInvoiceId !== null) {
            $uniqueNumber = $uniqueNumber->ignore($ignoreInvoiceId);
        }

        return [
            'invoice_number' => ['required', 'string', 'max:64', $uniqueNumber],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'billing_address' => ['nullable', 'string', 'max:2000'],
            'billing_city' => ['nullable', 'string', 'max:255'],
            'billing_state' => ['nullable', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'customer_note' => ['nullable', 'string', 'max:5000'],
            'intent' => ['required', Rule::in(['draft', 'send'])],
            'order_id' => ['nullable', 'string', 'exists:orders,id'],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.description' => ['required', 'string', 'max:512'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001', 'max:999999'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    protected function prepareComposedInvoice(): void
    {
        $merge = [];

        foreach (['customer_email', 'customer_phone', 'billing_address', 'billing_city', 'billing_state', 'due_date', 'customer_note'] as $field) {
            if ($this->input($field) === '') {
                $merge[$field] = null;
            }
        }

        foreach (['discount', 'tax'] as $field) {
            if ($this->input($field) === '' || $this->input($field) === null) {
                $merge[$field] = 0;
            }
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }
}
