<?php

use App\Models\Admin;
use Database\Seeders\BrandSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

uses(RefreshDatabase::class);

test('storefront pages share navigation built from categories and brands', function () {
    if (! File::exists(public_path('output/index.json'))) {
        $this->markTestSkipped('public/output not present');
    }

    $this->seed(ProductTemplateSeeder::class);
    $this->seed(CategorySeeder::class);
    $this->seed(BrandSeeder::class);

    $response = $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('storefrontNav')
            ->where('storefrontNav.0.label', 'Shop All')
            ->where('storefrontNav.0.href', route('shop')));

    $nav = $response->original->getData()['page']['props']['storefrontNav'];
    $labels = collect($nav)->pluck('label');

    expect(collect($nav)->pluck('handle'))->toContain('furniture')
        ->and($labels)->toContain('View all Brands')
        ->and($labels)->toContain('Contact');

    $furniture = collect($nav)->firstWhere('handle', 'furniture');

    expect($furniture)->not->toBeNull()
        ->and($furniture)->toHaveKey('columns');
});

test('admin pages do not include storefront navigation payload', function () {
    $this->seed(ProductTemplateSeeder::class);

    $this->actingAs(
        Admin::factory()->create(),
        'admin',
    )
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('storefrontNav', []));
});
