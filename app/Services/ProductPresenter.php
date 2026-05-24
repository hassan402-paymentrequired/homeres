<?php

namespace App\Services;

use App\Models\Product;

class ProductPresenter
{
    public function __construct(private ProductImageSync $imageSync) {}

    /**
     * @return array<string, mixed>
     */
    public function card(Product $product): array
    {
        $images = $this->imageSync->serialize(
            $product->relationLoaded('images') ? $product->images : $product->images()->get(),
        );

        return [
            'id' => $product->id,
            'name' => $product->name,
            'status' => $product->is_active ? 'published' : 'draft',
            'is_active' => $product->is_active,
            'thumbnail_url' => $images[0]['url'] ?? null,
            'category' => $product->relationLoaded('category') && $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
            ] : null,
            'brand' => $product->relationLoaded('brand') && $product->brand ? [
                'id' => $product->brand->id,
                'name' => $product->brand->name,
            ] : null,
            'variants_count' => (int) ($product->variants_count ?? $product->variants()->count()),
        ];
    }
}
