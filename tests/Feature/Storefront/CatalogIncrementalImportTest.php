<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CatalogProductImporter;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

uses(RefreshDatabase::class);

test('catalog import upserts existing product by shopify product id', function () {
    $this->seed(ProductTemplateSeeder::class);

    $categoryA = Category::factory()->create(['handle' => 'lanterns-chandeliers']);
    $categoryB = Category::factory()->create(['handle' => 'home-fragrance']);
    $brand = Brand::factory()->create(['handle' => 'baccarat', 'name' => 'BACCARAT']);

    $existing = Product::factory()->create([
        'category_id' => $categoryA->id,
        'brand_id' => $brand->id,
        'handle' => 'test-candle',
        'shopify_product_id' => 9_999_001,
        'name' => 'Old Title',
    ]);
    ProductVariant::factory()->create(['product_id' => $existing->id]);

    $dir = public_path('output/collections');
    File::ensureDirectoryExists($dir);
    $file = $dir.'/home-fragrance.json';
    File::put($file, json_encode([
        'handle' => 'home-fragrance',
        'label' => 'Home Fragrance',
        'products' => [
            [
                'id' => 9_999_001,
                'title' => 'Updated Title',
                'handle' => 'test-candle',
                'vendor' => 'BACCARAT',
                'available' => true,
                'currency' => 'EUR',
                'variants' => [
                    ['title' => 'Default Title', 'price' => '120.00', 'available' => true],
                ],
            ],
        ],
    ], JSON_THROW_ON_ERROR));

    $result = app(CatalogProductImporter::class)->import(
        collection: 'home-fragrance',
        limit: 0,
        publish: true,
        refresh: true,
    );

    $existing->refresh();

    expect($result['updated'])->toBe(1)
        ->and($result['imported'])->toBe(0)
        ->and($existing->name)->toBe('Updated Title')
        ->and($existing->category_id)->toBe($categoryB->id);

    File::delete($file);
});

test('catalog manifest command writes nav handles file', function () {
    $path = public_path('output/catalog-manifest.json');

    if (File::exists($path)) {
        File::delete($path);
    }

    $this->artisan('catalog:manifest', ['--write' => true])
        ->assertSuccessful();

    expect(File::exists($path))->toBeTrue();

    /** @var array{collections: list<string>, brands: list<string>} $data */
    $data = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

    expect($data['collections'])->toContain('home-fragrance', 'lanterns-chandeliers')
        ->and($data['brands'])->toContain('assouline', 'arowonen');
});
