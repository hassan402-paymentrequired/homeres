<?php

namespace App\Services;

use App\Enums\StockStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StoreSetting;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CatalogProductImporter
{
    public function __construct(
        private ProductHandleGenerator $handleGenerator,
    ) {}

    /**
     * @return array{imported: int, skipped: int, missing_category: int, missing_brand: int, errors: list<string>}
     */
    public function import(?string $collection = null, int $limit = 50, bool $dryRun = false, bool $publish = false): array
    {
        $result = [
            'imported' => 0,
            'skipped' => 0,
            'missing_category' => 0,
            'missing_brand' => 0,
            'errors' => [],
        ];

        $files = $this->collectionFiles($collection);

        foreach ($files as $file) {
            $this->importCollectionFile($file, $limit, $dryRun, $publish, $result);
        }

        return $result;
    }

    /**
     * @param  array{imported: int, skipped: int, missing_category: int, missing_brand: int, errors: list<string>}  $result
     */
    private function importCollectionFile(string $file, int $limit, bool $dryRun, bool $publish, array &$result): void
    {
        /** @var array{handle?: string, products?: array<int, array<string, mixed>>} $payload */
        $payload = json_decode(File::get($file), true, flags: JSON_THROW_ON_ERROR);
        $handle = (string) ($payload['handle'] ?? '');

        if ($handle === '') {
            $result['errors'][] = "Missing handle in {$file}";

            return;
        }

        $category = Category::query()->where('handle', $handle)->first();

        if ($category === null) {
            $result['missing_category'] += count($payload['products'] ?? []);

            return;
        }

        $defaultPublished = $publish || StoreSetting::current()->default_product_status === 'published';
        $importedInFile = 0;

        foreach ($payload['products'] ?? [] as $entry) {
            if ($limit > 0 && $importedInFile >= $limit) {
                break;
            }

            $productHandle = (string) ($entry['handle'] ?? '');

            if ($productHandle === '') {
                continue;
            }

            if (Product::query()->where('handle', $productHandle)->exists()) {
                $result['skipped']++;

                continue;
            }

            $brand = $this->resolveBrand((string) ($entry['vendor'] ?? ''));

            if ($brand === null) {
                $result['missing_brand']++;

                continue;
            }

            if ($dryRun) {
                $result['imported']++;
                $importedInFile++;

                continue;
            }

            $product = Product::query()->create([
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'name' => (string) ($entry['title'] ?? $productHandle),
                'handle' => $productHandle,
                'description' => $this->plainDescription($entry),
                'specs' => null,
                'is_active' => $defaultPublished,
                'sort_order' => $this->nextProductSortOrder(),
            ]);

            $this->importImages($product, $entry);
            $this->importVariants($product, $entry);
            $result['imported']++;
            $importedInFile++;
        }
    }

    /**
     * @return list<string>
     */
    private function collectionFiles(?string $collection): array
    {
        $directory = public_path('output/collections');

        if ($collection !== null) {
            $path = $directory.'/'.Str::slug($collection).'.json';

            return File::exists($path) ? [$path] : [];
        }

        return collect(File::glob($directory.'/*.json'))
            ->sort()
            ->values()
            ->all();
    }

    private function resolveBrand(string $vendor): ?Brand
    {
        if ($vendor === '') {
            return null;
        }

        $handle = Str::slug(trim($vendor));
        $normalized = strtolower(trim($vendor));

        return Brand::query()
            ->where(function ($query) use ($handle, $normalized): void {
                $query->where('handle', $handle)
                    ->orWhereRaw('LOWER(name) = ?', [$normalized]);
            })
            ->first();
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function plainDescription(array $entry): ?string
    {
        $html = (string) ($entry['body_html'] ?? '');

        if ($html === '') {
            return null;
        }

        $text = trim(html_entity_decode(strip_tags($html)));

        return $text !== '' ? $text : null;
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function importImages(Product $product, array $entry): void
    {
        foreach ($entry['images'] ?? [] as $index => $image) {
            $url = (string) ($image['src'] ?? '');

            if ($url === '') {
                continue;
            }

            $product->images()->create([
                'path' => null,
                'url' => $url,
                'alt' => (string) ($image['alt'] ?? ''),
                'sort_order' => (int) $index,
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function importVariants(Product $product, array $entry): void
    {
        $variants = $entry['variants'] ?? [];
        $sort = 0;

        foreach ($variants as $variant) {
            $title = trim((string) ($variant['title'] ?? ''));
            $name = $title === '' || strcasecmp($title, 'Default Title') === 0
                ? 'Default'
                : $title;

            $price = (float) ($variant['price'] ?? 0);
            $priceOnRequest = $price <= 0;
            $available = (bool) ($variant['available'] ?? true);

            $sku = filled($variant['sku'] ?? null) ? (string) $variant['sku'] : null;

            if ($sku !== null && $product->variants()->where('sku', $sku)->exists()) {
                $sku = null;
            }

            ProductVariant::query()->create([
                'product_id' => $product->id,
                'name' => $name,
                'sku' => $sku,
                'option_values' => $this->mapOptionValues($variant),
                'price' => $priceOnRequest ? null : $price,
                'price_on_request' => $priceOnRequest,
                'stock_status' => $available
                    ? StockStatus::InStockRemote->value
                    : StockStatus::OutOfStock->value,
                'lead_time_days_air' => $available ? 14 : null,
                'lead_time_days_sea' => $available ? 45 : null,
                'weight_kg' => null,
                'quantity' => null,
                'is_active' => true,
                'sort_order' => $sort++,
            ]);
        }

        if ($variants === []) {
            ProductVariant::query()->create([
                'product_id' => $product->id,
                'name' => 'Default',
                'sku' => null,
                'option_values' => null,
                'price' => null,
                'price_on_request' => true,
                'stock_status' => StockStatus::OutOfStock->value,
                'lead_time_days_air' => null,
                'lead_time_days_sea' => null,
                'weight_kg' => null,
                'quantity' => null,
                'is_active' => true,
                'sort_order' => 0,
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $variant
     * @return array<string, string>|null
     */
    private function mapOptionValues(array $variant): ?array
    {
        $values = collect(['option1', 'option2', 'option3'])
            ->map(fn (string $key): ?string => filled($variant[$key] ?? null) ? trim((string) $variant[$key]) : null)
            ->filter(fn (?string $value): bool => $value !== null && strcasecmp($value, 'Default Title') !== 0)
            ->values();

        if ($values->isEmpty()) {
            return null;
        }

        return collect($values)
            ->mapWithKeys(fn (string $value, int $index): array => ['option_'.($index + 1) => $value])
            ->all();
    }

    private function nextProductSortOrder(): int
    {
        return ((int) Product::query()->max('sort_order')) + 1;
    }
}
