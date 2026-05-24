<?php

use App\Models\Admin;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('category catalog page exposes banner when configured', function () {
    Storage::fake('public');

    $category = Category::factory()->create([
        'handle' => 'bedroom',
        'name' => 'Bedroom',
        'description' => 'Restful spaces and bedding.',
        'banner_path' => 'categories/bedroom/banner.jpg',
        'banner_url' => 'https://cdn.example.test/bedroom.jpg',
    ]);

    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    $this->get(route('shop.category', 'bedroom'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('catalog/index')
            ->where('catalog.view', 'category')
            ->where('catalog.banner.title', 'Bedroom')
            ->where('catalog.banner.description', 'Restful spaces and bedding.')
            ->where('catalog.banner.imageUrl', 'https://cdn.example.test/bedroom.jpg'));
});

test('admins can upload a category banner image', function () {
    Storage::fake('public');

    $admin = Admin::factory()->create();
    $category = Category::factory()->create(['handle' => 'lighting']);

    $this->actingAs($admin, 'admin')
        ->put(route('admin.categories.update', $category), [
            'name' => $category->name,
            'description' => 'Ambient lighting.',
            'is_active' => '1',
            'show_in_nav' => '1',
            'banner' => UploadedFile::fake()->image('banner.jpg', 1600, 700),
        ])
        ->assertRedirect(route('admin.categories.show', $category));

    $category->refresh();

    expect($category->banner_path)->not->toBeNull()
        ->and($category->banner_url)->not->toBeNull();

    Storage::disk('public')->assertExists((string) $category->banner_path);
});
