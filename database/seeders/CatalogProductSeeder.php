<?php

namespace Database\Seeders;

use App\Services\CatalogProductImporter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CatalogProductSeeder extends Seeder
{
    public function run(): void
    {
        if (! File::exists(public_path('output/index.json'))) {
            $this->command?->warn('Skipped catalog products: public/output/index.json not found.');

            return;
        }

        $this->command?->info('Importing scraped products from public/output/collections…');

        $result = app(CatalogProductImporter::class)->import(limit: 0, publish: true);

        $this->command?->info("Imported: {$result['imported']}");
        $this->command?->line("Skipped (already in DB): {$result['skipped']}");
        $this->command?->line("Categories created: {$result['categories_created']}");
        $this->command?->line("Missing category: {$result['missing_category']}");
        $this->command?->line("Missing brand: {$result['missing_brand']}");

        if ($result['errors'] !== []) {
            $this->command?->warn('Errors:');
            foreach ($result['errors'] as $error) {
                $this->command?->line(" - {$error}");
            }
        }
    }
}
