<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogProductImporter;
use Database\Seeders\BrandSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

uses(RefreshDatabase::class);

test('catalog product seeder imports scraped collection when output exists', function () {
    if (! File::exists(public_path('output/index.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    $this->seed(ProductTemplateSeeder::class);
    $this->seed(CategorySeeder::class);
    $this->seed(BrandSeeder::class);

    $category = Category::query()->where('handle', 'sofas')->first();

    if ($category === null) {
        $this->markTestSkipped('sofas category missing from output index');
    }

    app(CatalogProductImporter::class)->import(collection: 'sofas', limit: 5);

    expect(Product::query()->count())->toBeGreaterThan(0)
        ->and(Brand::query()->count())->toBeGreaterThan(0);
})->group('catalog-output');
