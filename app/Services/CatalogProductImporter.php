<?php

namespace App\Services;

use App\Enums\StockStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTemplate;
use App\Models\ProductVariant;
use App\Models\StoreSetting;
use App\Support\Catalog\ScrapedProductPricing;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CatalogProductImporter
{
    /**
     * Shopify vendor strings that do not match brand handle/name exactly.
     *
     * @var array<string, string> vendor (lowercase) => brand handle
     */
    private const VENDOR_BRAND_ALIASES = [
        'arowonen' => 'arowonen',
        'missoni' => 'missoni-home',
        'gallotti & radice' => 'gallotti-radice',
        'londonart' => 'londonart',
    ];

    public function __construct(
        private ProductHandleGenerator $handleGenerator,
        private ScrapedProductPricing $pricing,
    ) {}

    /**
     * @return array{imported: int, updated: int, skipped: int, categories_created: int, missing_category: int, missing_brand: int, errors: list<string>}
     */
    public function import(
        ?string $collection = null,
        int $limit = 50,
        bool $dryRun = false,
        bool $publish = false,
        bool $refresh = false,
        bool $fromBrand = false,
    ): array {
        $result = [
            'imported' => 0,
            'updated' => 0,
            'skipped' => 0,
            'categories_created' => 0,
            'missing_category' => 0,
            'missing_brand' => 0,
            'errors' => [],
        ];

        $files = $this->scrapeFiles($collection, $fromBrand);
        $assignCategory = $collection !== null;

        foreach ($files as $file) {
            $this->importCollectionFile($file, $limit, $dryRun, $publish, $refresh, $assignCategory, $result);
        }

        return $result;
    }

    /**
     * @param  array{imported: int, updated: int, skipped: int, categories_created: int, missing_category: int, missing_brand: int, errors: list<string>}  $result
     */
    private function importCollectionFile(string $file, int $limit, bool $dryRun, bool $publish, bool $refresh, bool $assignCategory, array &$result): void
    {
        /** @var array{handle?: string, label?: string, products?: array<int, array<string, mixed>>} $payload */
        $payload = json_decode(File::get($file), true, flags: JSON_THROW_ON_ERROR);
        $handle = (string) ($payload['handle'] ?? '');

        if ($handle === '') {
            $result['errors'][] = "Missing handle in {$file}";

            return;
        }

        $category = $this->resolveCategory($handle, $payload, $dryRun, $result);

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

            $existing = $this->findExistingProduct($entry, $productHandle);

            if ($existing !== null && ! $refresh) {
                $result['skipped']++;

                continue;
            }

            $brand = $this->resolveBrand((string) ($entry['vendor'] ?? ''));

            if ($brand === null) {
                $result['missing_brand']++;

                continue;
            }

            if ($dryRun) {
                $result[$existing !== null ? 'updated' : 'imported']++;
                $importedInFile++;

                continue;
            }

            if ($existing !== null) {
                $this->syncProduct($existing, $entry, $category, $brand, $assignCategory, $defaultPublished);
                $result['updated']++;
                $importedInFile++;

                continue;
            }

            $product = Product::query()->create([
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'name' => (string) ($entry['title'] ?? $productHandle),
                'handle' => $productHandle,
                'shopify_product_id' => $this->shopifyProductId($entry),
                'description' => $this->plainDescription($entry),
                'specs' => $this->productSpecs($entry),
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
    private function scrapeFiles(?string $collection, bool $fromBrand): array
    {
        $directory = public_path($fromBrand ? 'output/brands' : 'output/collections');

        if ($collection !== null) {
            $path = $directory.'/'.Str::slug($collection).'.json';

            return File::exists($path) ? [$path] : [];
        }

        return collect(File::glob($directory.'/*.json'))
            ->sort()
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function findExistingProduct(array $entry, string $handle): ?Product
    {
        $shopifyId = $this->shopifyProductId($entry);

        if ($shopifyId !== null) {
            $byShopify = Product::query()->where('shopify_product_id', $shopifyId)->first();

            if ($byShopify !== null) {
                return $byShopify;
            }
        }

        return Product::query()->where('handle', $handle)->first();
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function shopifyProductId(array $entry): ?int
    {
        $id = $entry['id'] ?? null;

        if ($id === null || $id === '') {
            return null;
        }

        return (int) $id;
    }

    /**
     * @param  array{handle?: string, label?: string, products?: array<int, array<string, mixed>>}  $payload
     * @param  array{imported: int, updated: int, skipped: int, categories_created: int, missing_category: int, missing_brand: int, errors: list<string>}  $result
     */
    private function resolveCategory(string $handle, array $payload, bool $dryRun, array &$result): ?Category
    {
        $existing = Category::query()->where('handle', $handle)->first();

        if ($existing !== null) {
            return $existing;
        }

        if ($dryRun) {
            $result['categories_created']++;

            return new Category([
                'handle' => $handle,
                'name' => $this->categoryLabel($handle, $payload),
            ]);
        }

        $templateId = ProductTemplate::query()->where('slug', 'simple')->value('id');

        if ($templateId === null) {
            $result['errors'][] = "Cannot create category \"{$handle}\": run ProductTemplateSeeder first.";

            return null;
        }

        $category = Category::query()->create([
            'parent_id' => null,
            'product_template_id' => $templateId,
            'name' => $this->categoryLabel($handle, $payload),
            'handle' => $handle,
            'description' => null,
            'nav_group_label' => null,
            'sort_order' => ((int) Category::query()->max('sort_order')) + 1,
            'is_active' => true,
            'show_in_nav' => false,
            'is_aggregate' => false,
        ]);

        $result['categories_created']++;

        return $category;
    }

    /**
     * @param  array{label?: string}  $payload
     */
    private function categoryLabel(string $handle, array $payload): string
    {
        $label = trim((string) ($payload['label'] ?? ''));

        if ($label !== '') {
            return $label;
        }

        return str($handle)->replace('-', ' ')->title()->toString();
    }

    private function resolveBrand(string $vendor): ?Brand
    {
        if ($vendor === '') {
            return null;
        }

        $normalized = strtolower(trim($vendor));
        $handle = self::VENDOR_BRAND_ALIASES[$normalized] ?? Str::slug(trim($vendor));

        $brand = Brand::query()
            ->where(function ($query) use ($handle, $normalized): void {
                $query->where('handle', $handle)
                    ->orWhereRaw('LOWER(name) = ?', [$normalized]);
            })
            ->first();

        if ($brand !== null) {
            return $brand;
        }

        return Brand::query()->firstOrCreate(
            ['handle' => $handle],
            [
                'name' => trim($vendor),
                'description' => null,
                'sort_order' => (int) Brand::query()->max('sort_order') + 1,
                'is_active' => true,
                'show_in_nav' => false,
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    /**
     * @param  array<string, mixed>  $entry
     */
    private function syncProduct(
        Product $product,
        array $entry,
        Category $category,
        Brand $brand,
        bool $assignCategory,
        bool $publish,
    ): void {
        $updates = [
            'brand_id' => $brand->id,
            'name' => (string) ($entry['title'] ?? $product->handle),
            'description' => $this->plainDescription($entry),
            'specs' => $this->productSpecs($entry),
        ];

        if ($assignCategory) {
            $updates['category_id'] = $category->id;
        }

        if ($publish) {
            $updates['is_active'] = true;
        }

        $shopifyId = $this->shopifyProductId($entry);

        if ($shopifyId !== null && $product->shopify_product_id === null) {
            $updates['shopify_product_id'] = $shopifyId;
        }

        $product->update($updates);

        $product->variants()->delete();
        $product->images()->delete();
        $this->importImages($product, $entry);
        $this->importVariants($product, $entry);
    }

    /**
     * @param  array<string, mixed>  $entry
     * @return array<string, mixed>|null
     */
    private function productSpecs(array $entry): ?array
    {
        $currency = filled($entry['currency'] ?? null)
            ? strtoupper((string) $entry['currency'])
            : null;

        if ($currency === null) {
            return null;
        }

        return ['currency' => $currency];
    }

    /**
     * @param  array<string, mixed>  $entry
     */
    private function plainDescription(array $entry): ?string
    {
        $html = (string) ($entry['description_html'] ?? $entry['body_html'] ?? '');

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
        $variantCount = is_countable($variants) ? count($variants) : 0;
        $productAvailable = (bool) ($entry['available'] ?? true);
        $sort = 0;

        foreach ($variants as $variant) {
            $title = trim((string) ($variant['title'] ?? ''));
            $name = $title === '' || strcasecmp($title, 'Default Title') === 0
                ? 'Default'
                : $title;

            $price = $this->pricing->resolveVariantPrice($entry, $variant, $variantCount);
            $priceOnRequest = $price === null;
            $available = (bool) ($variant['available'] ?? $productAvailable);

            $sku = filled($variant['sku'] ?? null) ? (string) $variant['sku'] : null;

            if ($sku !== null && $product->variants()->where('sku', $sku)->exists()) {
                $sku = null;
            }

            ProductVariant::query()->create([
                'product_id' => $product->id,
                'name' => $name,
                'sku' => $sku,
                'option_values' => $this->mapOptionValues($variant),
                'price' => $price,
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
            $price = $this->pricing->parse($entry['price_min'] ?? null)
                ?? $this->pricing->parse($entry['price_max'] ?? null);
            $priceOnRequest = $price === null;

            ProductVariant::query()->create([
                'product_id' => $product->id,
                'name' => 'Default',
                'sku' => null,
                'option_values' => null,
                'price' => $price,
                'price_on_request' => $priceOnRequest,
                'stock_status' => $productAvailable
                    ? StockStatus::InStockRemote->value
                    : StockStatus::OutOfStock->value,
                'lead_time_days_air' => $productAvailable ? 14 : null,
                'lead_time_days_sea' => $productAvailable ? 45 : null,
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
