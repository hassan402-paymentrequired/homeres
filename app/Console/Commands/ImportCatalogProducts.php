<?php

namespace App\Console\Commands;

use App\Services\CatalogProductImporter;
use Illuminate\Console\Command;

class ImportCatalogProducts extends Command
{
    protected $signature = 'catalog:import-products
                            {--collection= : Import a single collection handle}
                            {--brand : Read JSON from public/output/brands/ instead of collections/}
                            {--limit=0 : Maximum products per collection (0 = unlimited)}
                            {--dry-run : Preview without writing to the database}
                            {--publish : Mark imported products as active on the storefront}
                            {--refresh : Update prices and variants for products already in the database}';

    protected $description = 'Import scraped products from public/output/collections into the admin catalog';

    public function handle(CatalogProductImporter $importer): int
    {
        $result = $importer->import(
            collection: $this->option('collection'),
            limit: (int) $this->option('limit'),
            dryRun: (bool) $this->option('dry-run'),
            publish: (bool) $this->option('publish'),
            refresh: (bool) $this->option('refresh'),
            fromBrand: (bool) $this->option('brand'),
        );

        $this->info("Imported: {$result['imported']}");
        $this->line("Updated: {$result['updated']}");
        $this->line("Skipped: {$result['skipped']}");
        $this->line("Categories created: {$result['categories_created']}");
        $this->line("Missing category: {$result['missing_category']}");
        $this->line("Missing brand: {$result['missing_brand']}");

        if ($result['errors'] !== []) {
            $this->warn('Errors:');
            foreach ($result['errors'] as $error) {
                $this->line(" - {$error}");
            }
        }

        return self::SUCCESS;
    }
}
