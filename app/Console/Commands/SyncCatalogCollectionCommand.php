<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogProductImporter;
use App\Support\Catalog\CatalogScrapeManifest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class SyncCatalogCollectionCommand extends Command
{
    protected $signature = 'catalog:sync
                            {handle : Collection or brand handle from catalog:manifest}
                            {--brand : Handle is a brand (scrapes public/output/brands/)}
                            {--scrape-only : Only run the Node scraper}
                            {--import-only : Only import existing JSON (skip scrape)}
                            {--dry-run : Preview import counts without writing}';

    protected $description = 'Scrape one Arowonen collection/brand, then upsert products into the database';

    public function handle(CatalogScrapeManifest $manifest, CatalogProductImporter $importer): int
    {
        $handle = (string) $this->argument('handle');
        $isBrand = (bool) $this->option('brand');

        if ($isBrand && ! $manifest->isBrand($handle)) {
            $this->warn("\"{$handle}\" is not in the brand manifest — continuing anyway.");
        }

        if (! $isBrand && ! $manifest->isCollection($handle)) {
            $this->warn("\"{$handle}\" is not in the collection manifest — continuing anyway.");
        }

        if (! $this->option('import-only')) {
            $this->info("Scraping {$handle}…");

            $scrape = Process::path(base_path())
                ->timeout(3600)
                ->run($this->scrapeCommand($handle, $isBrand));

            $output = $scrape->output();
            $this->output->write($output);

            Log::info('catalog:sync scrape finished', [
                'handle' => $handle,
                'brand' => $isBrand,
                'exit_code' => $scrape->exitCode(),
                'output' => $output,
                'error' => $scrape->errorOutput(),
            ]);

            if (! $scrape->successful()) {
                $this->error($scrape->errorOutput() ?: 'Scraper failed.');

                return self::FAILURE;
            }

            $this->reportScrapeResult($handle, $isBrand);
        }

        if ($this->option('scrape-only')) {
            $this->info('Scrape complete (import skipped).');

            return self::SUCCESS;
        }

        $this->info("Importing {$handle}…");

        $result = $importer->import(
            collection: $handle,
            limit: 0,
            dryRun: (bool) $this->option('dry-run'),
            publish: true,
            refresh: true,
            fromBrand: $isBrand,
        );

        $this->info("Imported: {$result['imported']}");
        $this->line("Updated: {$result['updated']}");
        $this->line("Skipped: {$result['skipped']}");
        $this->line("Missing brand: {$result['missing_brand']}");

        if ($category = Category::query()->where('handle', $handle)->first()) {
            $inCategory = Product::query()
                ->published()
                ->where('category_id', $category->id)
                ->count();
            $this->line("Published products in \"{$handle}\": {$inCategory}");
        }

        if ($result['errors'] !== []) {
            foreach ($result['errors'] as $error) {
                $this->warn(" - {$error}");
            }
        }

        Log::info('catalog:sync import finished', [
            'handle' => $handle,
            'brand' => $isBrand,
            'result' => $result,
        ]);

        $jsonPath = $isBrand
            ? public_path("output/brands/{$handle}.json")
            : public_path("output/collections/{$handle}.json");

        if (File::exists($jsonPath)) {
            /** @var array{product_count?: int, shopify_product_count?: int, scrape_method?: string} $payload */
            $payload = json_decode(File::get($jsonPath), true, flags: JSON_THROW_ON_ERROR);
            $count = (int) ($payload['product_count'] ?? 0);

            if ($count === 0) {
                $this->newLine();
                $this->warn("No products in {$jsonPath} — nothing to import.");
                $this->line('See public/output/scrape-debug/'.$handle.'.json for API details.');
                if ($handle === 'roberte-cavalli') {
                    $this->line('Note: Roberto Cavalli has 0 products on Arowonen\'s public API right now.');
                    $this->line('scented-candles (154 products) is a different collection — sync that handle instead.');
                }
            }
        }

        return self::SUCCESS;
    }

    private function reportScrapeResult(string $handle, bool $isBrand): void
    {
        $debugPath = public_path("output/scrape-debug/{$handle}.json");

        if (File::exists($debugPath)) {
            /** @var array<string, mixed> $debug */
            $debug = json_decode(File::get($debugPath), true, flags: JSON_THROW_ON_ERROR);
            $this->line("Scrape debug: {$debugPath}");
            $this->line('  scrape_method: '.($debug['scrape_method'] ?? 'unknown'));
            $this->line('  scraped_count: '.($debug['scraped_count'] ?? 0));
            if (isset($debug['collection_api']['pages'][0])) {
                $page = $debug['collection_api']['pages'][0];
                $this->line('  first API URL: '.($page['url'] ?? ''));
                $this->line('  first API status: '.($page['status'] ?? ''));
                $this->line('  products in first response: '.($page['products_in_response'] ?? ''));
            }
        }

        $jsonPath = $isBrand
            ? public_path("output/brands/{$handle}.json")
            : public_path("output/collections/{$handle}.json");

        if (! File::exists($jsonPath)) {
            return;
        }

        /** @var array{product_count?: int, shopify_product_count?: int} $payload */
        $payload = json_decode(File::get($jsonPath), true, flags: JSON_THROW_ON_ERROR);
        $this->line("JSON file: {$jsonPath}");
        $this->line('  product_count: '.($payload['product_count'] ?? 0));
        $this->line('  shopify_product_count: '.($payload['shopify_product_count'] ?? 0));
    }

    /**
     * @return list<string>
     */
    private function scrapeCommand(string $handle, bool $isBrand): array
    {
        $args = ['node', 'z.js', "--handle={$handle}"];

        if ($isBrand) {
            $args[] = '--brands-only';
        } else {
            $args[] = '--collections-only';
        }

        if ($this->output->isVerbose()) {
            $args[] = '--verbose';
        }

        return $args;
    }
}
