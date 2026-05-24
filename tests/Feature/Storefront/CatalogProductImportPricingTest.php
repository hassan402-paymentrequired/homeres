<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogProductImporter;
use App\Support\Storefront\StorefrontProductPresenter;
use Database\Seeders\BrandSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

uses(RefreshDatabase::class);

test('catalog import stores scraped prices and currency from output json', function () {
    if (! File::exists(public_path('output/index.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    $this->seed(ProductTemplateSeeder::class);
    $this->seed(CategorySeeder::class);
    $this->seed(BrandSeeder::class);

    $category = Category::query()->where('handle', 'art-mirrors')->first();

    if ($category === null) {
        $this->markTestSkipped('art-mirrors category missing');
    }

    app(CatalogProductImporter::class)->import(
        collection: 'art-mirrors',
        limit: 3,
        publish: true,
    );

    $product = Product::query()
        ->where('handle', 'mirror-novella')
        ->with('variants')
        ->first();

    expect($product)->not->toBeNull()
        ->and($product->specs['currency'] ?? null)->toBe('EUR');

    $variant = $product->variants->first();

    expect($variant->price_on_request)->toBeFalse()
        ->and((float) $variant->price)->toBe(1495.0);

    $this->withHeader('CF-IPCountry', 'NG')->get(route('shop'));

    $card = app(StorefrontProductPresenter::class)->card($product->fresh(['brand', 'category', 'images', 'variants']));

    expect($card['currency'])->toBe('NGN')
        ->and($card['priceOnRequest'])->toBeFalse()
        ->and($card['price'])->toBeGreaterThan(1000);
})->group('catalog-output');

test('catalog refresh updates variant pricing for existing products', function () {
    if (! File::exists(public_path('output/index.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    $this->seed(ProductTemplateSeeder::class);
    $this->seed(CategorySeeder::class);
    $this->seed(BrandSeeder::class);

    $category = Category::query()->where('handle', 'art-mirrors')->first();

    if ($category === null) {
        $this->markTestSkipped('art-mirrors category missing');
    }

    $brand = Brand::query()->whereRaw('LOWER(name) = ?', ['eichholtz'])->first()
        ?? Brand::factory()->create(['name' => 'Eichholtz', 'handle' => 'eichholtz']);

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'handle' => 'mirror-novella',
        'is_active' => true,
        'specs' => null,
    ]);

    $product->variants()->create([
        'name' => 'Default',
        'price' => null,
        'price_on_request' => true,
        'stock_status' => 'out_of_stock',
        'is_active' => true,
        'sort_order' => 0,
    ]);

    app(CatalogProductImporter::class)->import(
        collection: 'art-mirrors',
        limit: 0,
        refresh: true,
    );

    $product->refresh()->load('variants');
    $variant = $product->variants->first();

    expect($variant->price_on_request)->toBeFalse()
        ->and((float) $variant->price)->toBe(1495.0)
        ->and($product->specs['currency'] ?? null)->toBe('EUR');
})->group('catalog-output');
