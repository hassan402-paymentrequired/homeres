<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImageSync
{
    public function sync(Product $product, Request $request): void
    {
        $product->load('images');

        $this->syncCollection(
            $product->images->whereNull('product_variant_id'),
            $request,
            function (UploadedFile $file, int $index) use ($product, $request) {
                $path = $file->store("products/{$product->id}", 'public');

                return $product->images()->create([
                    'path' => $path,
                    'url' => $this->absolutePublicUrl($path),
                    'alt' => '',
                    'sort_order' => $this->nextSortOrder($request, $index),
                    'product_variant_id' => null,
                ]);
            },
        );
    }

    public function syncForVariant(ProductVariant $variant, Request $request): void
    {
        $variant->load('images');

        $this->syncCollection(
            $variant->images,
            $request,
            function (UploadedFile $file, int $index) use ($variant, $request) {
                $path = $file->store("products/{$variant->product_id}/variants/{$variant->id}", 'public');

                return $variant->images()->create([
                    'product_id' => $variant->product_id,
                    'path' => $path,
                    'url' => $this->absolutePublicUrl($path),
                    'alt' => '',
                    'sort_order' => $this->nextSortOrder($request, $index),
                ]);
            },
        );
    }

    public function deleteAll(Product $product): void
    {
        $product->load('images');
        $product->images->each(fn (ProductImage $image): bool => $this->delete($image));
    }

    /**
     * @param  Collection<int, ProductImage>|iterable<int, ProductImage>  $images
     * @return array<int, array{id: string, path: string|null, url: string, alt: string, position: int}>
     */
    public function serialize(iterable $images): array
    {
        return collect($images)
            ->sortBy('sort_order')
            ->values()
            ->map(fn (ProductImage $image): array => [
                'id' => $image->id,
                'path' => $image->path,
                'url' => filled($image->url)
                    ? $image->url
                    : (filled($image->path)
                        ? Storage::disk('public')->url((string) $image->path)
                        : ''),
                'alt' => (string) $image->alt,
                'position' => (int) $image->sort_order,
            ])
            ->all();
    }

    /**
     * @param  Collection<int, ProductImage>  $images
     */
    private function syncCollection(Collection $images, Request $request, callable $createUpload): void
    {
        $keepIds = collect($request->input('keep_images', []))->filter()->values();
        $altUpdates = collect($request->input('image_alts', []));

        $images
            ->filter(fn (ProductImage $image): bool => ! $keepIds->contains($image->id))
            ->each(fn (ProductImage $image): bool => $this->delete($image));

        $keepIds->each(function (string $id, int $position) use ($images, $altUpdates): void {
            $image = $images->firstWhere('id', $id);

            if ($image === null) {
                return;
            }

            $updates = [
                'alt' => (string) ($altUpdates->get($id) ?? $image->alt),
                'sort_order' => $position,
            ];

            if (filled($image->path) && ! filled($image->url)) {
                $updates['url'] = $this->absolutePublicUrl((string) $image->path);
            }

            $image->update($updates);
        });

        collect($request->file('images', []))
            ->filter(fn ($file): bool => $file instanceof UploadedFile)
            ->each($createUpload);
    }

    private function nextSortOrder(Request $request, int $uploadIndex): int
    {
        return collect($request->input('keep_images', []))->filter()->count() + $uploadIndex;
    }

    private function absolutePublicUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        $relative = Storage::disk('public')->url($path);

        if (Str::startsWith($relative, ['http://', 'https://', '//'])) {
            return $relative;
        }

        return rtrim((string) config('app.url'), '/').'/'.ltrim($relative, '/');
    }

    private function delete(ProductImage $image): bool
    {
        if (filled($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        return $image->delete();
    }
}
