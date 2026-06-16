<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNewsletterSubscriberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'source' => ['nullable', Rule::in(['modal', 'footer'])],
        ];
    }

    public function normalizedEmail(): string
    {
        return mb_strtolower(trim((string) $this->input('email')));
    }

    public function source(): string
    {
        $source = (string) $this->input('source', 'modal');

        return in_array($source, ['modal', 'footer'], true) ? $source : 'modal';
    }
}
