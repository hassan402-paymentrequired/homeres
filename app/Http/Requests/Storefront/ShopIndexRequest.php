<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShopIndexRequest extends FormRequest
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
            'q' => ['nullable', 'string', 'max:200'],
            'sub' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', Rule::in(['featured', 'price-asc', 'price-desc', 'name'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'new_only' => ['nullable', 'boolean'],
            'max_price' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function newOnly(): bool
    {
        return $this->boolean('new_only');
    }

    public function maxPrice(): ?int
    {
        if (! $this->filled('max_price')) {
            return null;
        }

        return $this->integer('max_price');
    }

    public function searchQuery(): ?string
    {
        $value = trim((string) $this->input('q', ''));

        return $value === '' ? null : $value;
    }

    public function subcategoryHandle(): ?string
    {
        $value = trim((string) $this->input('sub', ''));

        return $value === '' ? null : $value;
    }

    public function sort(): string
    {
        return (string) $this->input('sort', 'featured');
    }
}
