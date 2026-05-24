<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use App\Services\ProductTemplateValidator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProductRequest extends FormRequest
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
            'category_id' => ['required', 'string', Rule::exists('categories', 'id')],
            'brand_id' => ['nullable', 'string', Rule::exists('brands', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'specs' => ['nullable', 'array'],
            'status' => ['required', Rule::in(['published', 'draft'])],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:5120'],
            'keep_images' => ['nullable', 'array'],
            'keep_images.*' => ['string', 'max:26'],
            'image_alts' => ['nullable', 'array'],
            'image_alts.*' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Product $product */
            $product = $this->route('product');

            app(ProductTemplateValidator::class)->validate($this, $validator, $product);
        });
    }
}
