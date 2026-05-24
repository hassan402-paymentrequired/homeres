<?php

namespace App\Http\Requests\Admin;

use App\Enums\StockStatus;
use App\Models\Product;
use App\Services\ProductVariantNaming;
use App\Services\ProductVariantTemplateValidator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreProductVariantRequest extends FormRequest
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
        /** @var Product $product */
        $product = $this->route('product');
        $hasTemplateOptions = app(ProductVariantNaming::class)->variantOptionsFor($product) !== [];

        return [
            'name' => $hasTemplateOptions
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],
            'sku' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('product_variants', 'sku')->where('product_id', $product->id),
            ],
            'option_values' => ['nullable', 'array'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_on_request' => ['boolean'],
            'stock_status' => ['required', Rule::enum(StockStatus::class)],
            'lead_time_days_air' => ['nullable', 'integer', 'min:1'],
            'lead_time_days_sea' => ['nullable', 'integer', 'min:1'],
            'weight_kg' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Product $product */
            $product = $this->route('product');

            app(ProductVariantTemplateValidator::class)->validate($product, $validator);

            if ($this->input('stock_status') !== StockStatus::InStockRemote->value) {
                return;
            }

            if ($this->filled('lead_time_days_air') === false) {
                $validator->errors()->add('lead_time_days_air', 'Air lead time is required for remote stock.');
            }

            if ($this->filled('lead_time_days_sea') === false) {
                $validator->errors()->add('lead_time_days_sea', 'Sea lead time is required for remote stock.');
            }
        });
    }
}
