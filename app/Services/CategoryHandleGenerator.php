<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryHandleGenerator
{
    public function generate(string $name, ?string $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
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
        return Category::query()
            ->where('handle', $handle)
            ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }
}
