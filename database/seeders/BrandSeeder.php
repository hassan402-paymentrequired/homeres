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
            Brand::query()->firstOrCreate(
                ['handle' => $entry['handle']],
                [
                    'name' => $entry['label'],
                    'description' => null,
                    'sort_order' => $sort++,
                    'is_active' => true,
                    'show_in_nav' => true,
                ],
            );
        }

        app(BrandNavGroupService::class)->seedGroups();
    }
}
