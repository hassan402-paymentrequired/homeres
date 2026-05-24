<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Validation\Validator;

class ProductVariantTemplateValidator
{
    public function __construct(private ProductVariantNaming $naming) {}

    public function validate(Product $product, Validator $validator): void
    {
        $options = $this->naming->variantOptionsFor($product);

        if ($options === []) {
            return;
        }

        $values = is_array($this->requestOptionValues()) ? $this->requestOptionValues() : [];

        foreach ($options as $option) {
            if (! ($option['required'] ?? false)) {
                continue;
            }

            $key = (string) ($option['key'] ?? '');
            $value = trim((string) ($values[$key] ?? ''));

            if (($option['type'] ?? '') === 'boolean') {
                continue;
            }

            if ($value === '') {
                $label = (string) ($option['label'] ?? $key);
                $validator->errors()->add(
                    "option_values.{$key}",
                    "{$label} is required for this product template.",
                );
            }
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function requestOptionValues(): ?array
    {
        $values = request()->input('option_values');

        return is_array($values) ? $values : null;
    }
}
