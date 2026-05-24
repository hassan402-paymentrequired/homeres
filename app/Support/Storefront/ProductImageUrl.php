<?php

namespace App\Support\Storefront;

use App\Models\ProductImage;
use Illuminate\Support\Str;

final class ProductImageUrl
{
    public function resolve(ProductImage $image): string
    {
        if (filled($image->url)) {
            return $this->normalize((string) $image->url);
        }

        if (! filled($image->path)) {
            return '';
        }

        return $this->normalize((string) $image->path);
    }

    private function normalize(string $value): string
    {
        $value = trim($value);

        if ($value === '') {
            return '';
        }

        if (Str::startsWith($value, ['http://', 'https://', '//'])) {
            $path = parse_url($value, PHP_URL_PATH);

            if (is_string($path) && str_starts_with($path, '/storage/')) {
                return $path;
            }

            return $value;
        }

        if (Str::startsWith($value, ['/'])) {
            return $value;
        }

        if (Str::startsWith($value, 'storage/')) {
            return '/'.$value;
        }

        return '/storage/'.ltrim($value, '/');
    }
}
