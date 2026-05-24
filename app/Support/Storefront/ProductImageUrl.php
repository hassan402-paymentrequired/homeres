<?php

namespace App\Support\Storefront;

use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ProductImageUrl
{
    public function resolve(ProductImage $image): string
    {
        if (filled($image->url)) {
            return (string) $image->url;
        }

        if (! filled($image->path)) {
            return '';
        }

        $path = (string) $image->path;

        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
