<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTemplate;
use App\Services\CatalogProductImporter;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

uses(RefreshDatabase::class);

test('catalog import creates missing categories from collection json', function () {
    if (! File::exists(public_path('output/collections/art-mirrors.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    $this->seed(ProductTemplateSeeder::class);
    Brand::factory()->create([
        'name' => 'Eichholtz',
        'handle' => 'eichholtz',
    ]);

    expect(Category::query()->where('handle', 'art-mirrors')->exists())->toBeFalse();

    $result = app(CatalogProductImporter::class)->import(
        collection: 'art-mirrors',
        limit: 2,
        publish: true,
    );

    $category = Category::query()->where('handle', 'art-mirrors')->first();

    expect($result['categories_created'])->toBe(1)
        ->and($result['imported'])->toBe(2)
        ->and($result['missing_category'])->toBe(0)
        ->and($category)->not->toBeNull()
        ->and($category->name)->toBe('Art & Mirrors (All)')
        ->and(Product::query()->where('category_id', $category->id)->count())->toBe(2);
});

test('catalog import reports missing category when product template seeder was not run', function () {
    if (! File::exists(public_path('output/collections/art-mirrors.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    ProductTemplate::query()->delete();

    $result = app(CatalogProductImporter::class)->import(
        collection: 'art-mirrors',
        limit: 1,
    );

    expect($result['missing_category'])->toBeGreaterThan(0)
        ->and($result['errors'])->not->toBeEmpty();
});
