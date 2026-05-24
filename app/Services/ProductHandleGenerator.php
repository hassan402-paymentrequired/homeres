<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductHandleGenerator
{
    public function generate(string $name, ?string $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $handle = $base;
        $suffix = 2;

        while ($this->exists($handle, $ignoreId)) {
            $handle = $base.'-'.$suffix;
            $suffix++;
        }

        return $handle;
    }

    private function exists(string $handle, ?string $ignoreId): bool
    {
        return Product::query()
            ->where('handle', $handle)
            ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }
}
