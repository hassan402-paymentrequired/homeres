<?php

namespace App\Services;

use App\Models\ProductTemplate;
use Illuminate\Support\Str;

class ProductTemplateSlugGenerator
{
    public function generate(string $name, ?string $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'template';
        $slug = $base;
        $suffix = 2;

        while ($this->exists($slug, $ignoreId)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function exists(string $slug, ?string $ignoreId): bool
    {
        return ProductTemplate::query()
            ->where('slug', $slug)
            ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }
}
