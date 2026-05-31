<?php

namespace App\Support\Catalog;

use Illuminate\Support\Facades\File;

final class CatalogScrapeManifest
{
    public function path(): string
    {
        return public_path('output/catalog-manifest.json');
    }

    /**
     * @return array{collections: list<string>, brands: list<string>, generated_at?: string}
     */
    public function fromConfig(): array
    {
        /** @var array{collections?: list<string>, brands?: list<string>} $config */
        $config = config('catalog-scrape', []);

        return [
            'collections' => array_values($config['collections'] ?? []),
            'brands' => array_values($config['brands'] ?? []),
        ];
    }

    /**
     * @return array{collections: list<string>, brands: list<string>, generated_at?: string}
     */
    public function read(): array
    {
        $path = $this->path();

        if (! File::exists($path)) {
            return $this->fromConfig();
        }

        /** @var array{collections?: list<string>, brands?: list<string>} $data */
        $data = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

        return [
            'collections' => array_values($data['collections'] ?? []),
            'brands' => array_values($data['brands'] ?? []),
            'generated_at' => $data['generated_at'] ?? null,
        ];
    }

    public function write(): string
    {
        $data = [
            ...$this->fromConfig(),
            'generated_at' => now()->toIso8601String(),
            'source' => 'https://arowonen.com',
        ];

        File::ensureDirectoryExists(dirname($this->path()));
        File::put($this->path(), json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return $this->path();
    }

    public function isBrand(string $handle): bool
    {
        return in_array($handle, $this->read()['brands'], true);
    }

    public function isCollection(string $handle): bool
    {
        return in_array($handle, $this->read()['collections'], true);
    }
}
