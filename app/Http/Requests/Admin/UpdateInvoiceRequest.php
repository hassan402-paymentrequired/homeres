<?php

namespace App\Http\Requests\Admin;

use App\Enums\InvoiceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoiceRequest extends FormRequest
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
            'status' => ['required', Rule::enum(InvoiceStatus::class)],
            'admin_note' => ['nullable', 'string', 'max:5000'],
            'due_at' => ['nullable', 'date'],
        ];
    }
}
