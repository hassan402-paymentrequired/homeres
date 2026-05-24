<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class ProductImageSync
{
    public function sync(Product $product, Request $request): void
    {
        $product->load('images');

        $keepIds = collect($request->input('keep_images', []))->filter()->values();
        $altUpdates = collect($request->input('image_alts', []));

        $product->images
            ->filter(fn (ProductImage $image): bool => ! $keepIds->contains($image->id))
            ->each(fn (ProductImage $image): bool => $this->delete($image));

        $keepIds->each(function (string $id, int $position) use ($product, $altUpdates): void {
            /** @var ProductImage|null $image */
            $image = $product->images->firstWhere('id', $id);

            if ($image === null) {
                return;
            }

            $image->update([
                'alt' => (string) ($altUpdates->get($id) ?? $image->alt),
                'sort_order' => $position,
            ]);
        });

        $uploads = collect($request->file('images', []))
            ->filter(fn ($file): bool => $file instanceof UploadedFile);

        $uploads->each(function (UploadedFile $file, int $index) use ($product, $keepIds): void {
            $path = $file->store("products/{$product->id}", 'public');

            $product->images()->create([
                'path' => $path,
                'url' => null,
                'alt' => '',
                'sort_order' => $keepIds->count() + $index,
            ]);
        });
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

    private function delete(ProductImage $image): bool
    {
        if (filled($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        return $image->delete();
    }
}
