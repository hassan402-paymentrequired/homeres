<?php

use App\Models\Admin;
use App\Models\Brand;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
});

test('guests cannot access brands admin', function () {
    $this->get(route('admin.brands.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view brands index', function () {
    Brand::factory()->create(['name' => 'Baccarat', 'handle' => 'baccarat']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/brands/index')
            ->has('brands.data', 1)
            ->where('brands.per_page', 15));
});

test('brand index paginates at fifteen per page', function () {
    Brand::factory()->count(16)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('brands.data', 15)
            ->where('brands.total', 16)
            ->where('brands.current_page', 1));

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('brands.data', 1)
            ->where('brands.current_page', 2));
});

test('admins can view a brand detail page', function () {
    $brand = Brand::factory()->create(['name' => 'Flos', 'handle' => 'flos']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.show', $brand))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/brands/show')
            ->where('brand.name', 'Flos')
            ->has('stats')
            ->has('breadcrumbs'));
});

test('admins can create a brand with auto-generated identifier', function () {
    Brand::factory()->create(['handle' => 'existing', 'sort_order' => 2]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.brands.store'), [
            'name' => 'Tom Dixon',
            'is_active' => '1',
            'show_in_nav' => '1',
        ]);

    $brand = Brand::query()->where('handle', 'tom-dixon')->first();

    expect($brand)->not->toBeNull()
        ->and($brand->name)->toBe('Tom Dixon')
        ->and($brand->sort_order)->toBe(3);

    $response->assertRedirect(route('admin.brands.show', $brand));
});

test('admins can update a brand', function () {
    $brand = Brand::factory()->create([
        'name' => 'Old Brand',
        'handle' => 'old-brand',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.brands.update', $brand), [
            'name' => 'Updated Brand',
            'is_active' => '1',
            'show_in_nav' => '0',
        ])
        ->assertRedirect(route('admin.brands.show', $brand));

    expect($brand->fresh()->name)->toBe('Updated Brand')
        ->and($brand->fresh()->handle)->toBe('old-brand')
        ->and($brand->fresh()->show_in_nav)->toBeFalse();
});

test('admins can delete a brand', function () {
    $brand = Brand::factory()->create(['handle' => 'delete-me']);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.brands.destroy', $brand))
        ->assertRedirect(route('admin.brands.index'));

    expect(Brand::query()->whereKey($brand->id)->exists())->toBeFalse();
});

test('brand seeder imports brands from output index', function () {
    if (! file_exists(public_path('output/index.json'))) {
        $this->markTestSkipped('Scraped output index is not available.');
    }

    $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\BrandSeeder'])->assertSuccessful();

    expect(Brand::query()->count())->toBeGreaterThan(30)
        ->and(Brand::query()->where('handle', 'baccarat')->exists())->toBeTrue();
});
