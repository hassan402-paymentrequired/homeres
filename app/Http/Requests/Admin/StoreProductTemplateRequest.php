<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductTemplateRequest extends FormRequest
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
        return $this->sharedRules();
    }

    /**
     * @return array<string, mixed>
     */
    protected function sharedRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'spec_fields' => ['nullable', 'array'],
            'spec_fields.*.key' => ['nullable', 'string', 'max:100'],
            'spec_fields.*.label' => ['nullable', 'string', 'max:255'],
            'spec_fields.*.type' => ['nullable', 'string', Rule::in(['text', 'textarea', 'select', 'swatch', 'boolean'])],
            'spec_fields.*.required' => ['nullable', 'boolean'],
            'spec_fields.*.options' => ['nullable'],
            'variant_options' => ['nullable', 'array'],
            'variant_options.*.key' => ['nullable', 'string', 'max:100'],
            'variant_options.*.label' => ['nullable', 'string', 'max:255'],
            'variant_options.*.type' => ['nullable', 'string', Rule::in(['text', 'textarea', 'select', 'swatch', 'boolean'])],
            'variant_options.*.required' => ['nullable', 'boolean'],
            'variant_options.*.options' => ['nullable'],
            'rules.pricing_mode' => ['required', Rule::in(['fixed', 'on_request'])],
            'rules.requires_brand' => ['boolean'],
            'rules.min_images' => ['nullable', 'integer', 'min:0', 'max:20'],
            'rules.storefront_specs_title' => ['nullable', 'string', 'max:255'],
            'rules.specs_layout' => ['nullable', Rule::in(['single', 'two_column'])],
        ];
    }
}
