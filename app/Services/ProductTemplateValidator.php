<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;

class ProductTemplateValidator
{
    public function validate(Request $request, Validator $validator, ?Product $product = null): void
    {
        $categoryId = $request->input('category_id');

        if (! is_string($categoryId) || $categoryId === '') {
            return;
        }

        $category = Category::query()
            ->with('productTemplate')
            ->find($categoryId);

        $template = $category?->productTemplate;

        if ($template === null) {
            return;
        }

        $rules = $template->rules ?? [];

        if (($rules['requires_brand'] ?? false) && ! $request->filled('brand_id')) {
            $validator->errors()->add(
                'brand_id',
                'Brand is required for this category template.',
            );
        }

        $minImages = (int) ($rules['min_images'] ?? 0);

        if ($minImages > 0) {
            $keepCount = count($request->input('keep_images', []));
            $uploadCount = count(array_filter($request->file('images', []) ?? []));
            $total = $keepCount + $uploadCount;

            if ($total < $minImages) {
                $validator->errors()->add(
                    'images',
                    "At least {$minImages} product image(s) are required for this template.",
                );
            }
        }

        $specs = is_array($request->input('specs')) ? $request->input('specs') : [];

        foreach ($template->spec_fields ?? [] as $field) {
            if (! ($field['required'] ?? false)) {
                continue;
            }

            $key = (string) ($field['key'] ?? '');
            $label = (string) ($field['label'] ?? $key);
            $value = trim((string) ($specs[$key] ?? ''));

            if ($value === '') {
                $validator->errors()->add(
                    "specs.{$key}",
                    "{$label} is required for this product template.",
                );
            }
        }

        if ($product !== null) {
            $keepIds = collect($request->input('keep_images', []))->filter()->values();
            $invalidIds = $keepIds->diff(
                $product->images()->whereIn('id', $keepIds)->pluck('id'),
            );

            if ($invalidIds->isNotEmpty()) {
                $validator->errors()->add('keep_images', 'One or more images do not belong to this product.');
            }
        }
    }
}
