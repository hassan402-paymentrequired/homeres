<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'parent_id' => $this->input('parent_id') ?: null,
            'product_template_id' => $this->input('product_template_id') ?: null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'string', Rule::exists(Category::class, 'id')],
            'product_template_id' => ['nullable', 'string', Rule::exists('product_templates', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'nav_group_label' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'show_in_nav' => ['boolean'],
        ];
    }
}
