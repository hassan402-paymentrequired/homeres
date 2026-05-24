<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryBannerSync
{
    public function sync(Category $category, Request $request): void
    {
        if ($request->boolean('remove_banner')) {
            $this->deleteStoredFile($category);
            $category->update([
                'banner_path' => null,
                'banner_url' => null,
            ]);

            return;
        }

        $file = $request->file('banner');

        if (! $file instanceof UploadedFile) {
            return;
        }

        $this->deleteStoredFile($category);

        $path = $file->store("categories/{$category->id}", 'public');

        $category->update([
            'banner_path' => $path,
            'banner_url' => $this->absolutePublicUrl($path),
        ]);
    }

    public function delete(Category $category): void
    {
        $this->deleteStoredFile($category);
    }

    public function publicUrl(Category $category): ?string
    {
        if (filled($category->banner_url)) {
            return (string) $category->banner_url;
        }

        if (! filled($category->banner_path)) {
            return null;
        }

        return $this->absolutePublicUrl((string) $category->banner_path);
    }

    private function deleteStoredFile(Category $category): void
    {
        if (filled($category->banner_path)) {
            Storage::disk('public')->delete((string) $category->banner_path);
        }
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
}
