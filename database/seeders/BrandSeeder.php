<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Services\BrandNavGroupService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $path = public_path('output/index.json');

        if (! File::exists($path)) {
            return;
        }

        /** @var array{brands?: array<int, array{handle: string, label: string, product_count?: int}>} $index */
        $index = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

        $sort = 0;

        foreach ($index['brands'] ?? [] as $entry) {
            $this->upsertBrand($entry['handle'], $entry['label'], $sort++);
        }

        foreach (File::glob(public_path('output/brands/*.json')) ?: [] as $file) {
            /** @var array{handle?: string, label?: string} $payload */
            $payload = json_decode(File::get($file), true, flags: JSON_THROW_ON_ERROR);
            $handle = (string) ($payload['handle'] ?? '');

            if ($handle === '' || Brand::query()->where('handle', $handle)->exists()) {
                continue;
            }

            $this->upsertBrand($handle, (string) ($payload['label'] ?? $handle), $sort++);
        }

        app(BrandNavGroupService::class)->seedGroups();
    }

    private function upsertBrand(string $handle, string $name, int $sortOrder): void
    {
        Brand::query()->firstOrCreate(
            ['handle' => $handle],
            [
                'name' => $name,
                'description' => null,
                'sort_order' => $sortOrder,
                'is_active' => true,
                'show_in_nav' => true,
            ],
        );
    }
}
