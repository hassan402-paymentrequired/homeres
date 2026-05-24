<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderInvoiceRequest extends FormRequest
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
            'send' => ['boolean'],
            'recipient_email' => ['nullable', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
