<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStoreSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'store_name' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'default_product_status' => ['required', Rule::in(['draft', 'published'])],
            'invoice_due_days' => ['required', 'integer', 'min:1', 'max:365'],
            'invoice_default_notes' => ['nullable', 'string', 'max:5000'],
            'invoice_payment_instructions' => ['nullable', 'string', 'max:5000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        foreach ([
            'store_name',
            'contact_email',
            'contact_phone',
            'invoice_default_notes',
            'invoice_payment_instructions',
        ] as $field) {
            if ($this->input($field) === '') {
                $merge[$field] = null;
            }
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }
}
