<?php

namespace App\Console\Commands;

use App\Support\Catalog\CatalogScrapeManifest;
use Illuminate\Console\Command;

class CatalogManifestCommand extends Command
{
    protected $signature = 'catalog:manifest
                            {--write : Write public/output/catalog-manifest.json from config}';

    protected $description = 'List nav collection & brand handles for incremental Arowonen scrape/import';

    public function handle(CatalogScrapeManifest $manifest): int
    {
        if ($this->option('write')) {
            $path = $manifest->write();
            $this->info("Wrote {$path}");
        }

        $data = $manifest->read();

        $this->line('Collections ('.count($data['collections']).'):');
        foreach ($data['collections'] as $i => $handle) {
            $this->line(sprintf('  %3d. %s', $i + 1, $handle));
        }

        $this->newLine();
        $this->line('Brands ('.count($data['brands']).'):');
        foreach ($data['brands'] as $i => $handle) {
            $this->line(sprintf('  %3d. %s', $i + 1, $handle));
        }

        $this->newLine();
        $this->comment('Sync one collection:');
        $this->line('  php artisan catalog:sync home-fragrance');
        $this->comment('Sync one brand:');
        $this->line('  php artisan catalog:sync assouline --brand');

        return self::SUCCESS;
    }
}
