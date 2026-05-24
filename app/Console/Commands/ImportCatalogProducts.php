<?php

namespace App\Console\Commands;

use App\Services\CatalogProductImporter;
use Illuminate\Console\Command;

class ImportCatalogProducts extends Command
{
    protected $signature = 'catalog:import-products
                            {--collection= : Import a single collection handle}
                            {--limit=0 : Maximum products per collection (0 = unlimited)}
                            {--dry-run : Preview without writing to the database}';

    protected $description = 'Import scraped products from public/output/collections into the admin catalog';

    public function handle(CatalogProductImporter $importer): int
    {
        $result = $importer->import(
            collection: $this->option('collection'),
            limit: (int) $this->option('limit'),
            dryRun: (bool) $this->option('dry-run'),
        );

        $this->info("Imported: {$result['imported']}");
        $this->line("Skipped: {$result['skipped']}");
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
