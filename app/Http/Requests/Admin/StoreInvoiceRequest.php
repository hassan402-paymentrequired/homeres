<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesComposedInvoice;
use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    use ValidatesComposedInvoice;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareComposedInvoice();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->composedInvoiceRules();
    }
}
