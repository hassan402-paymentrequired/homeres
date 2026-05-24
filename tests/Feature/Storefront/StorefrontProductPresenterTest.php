<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductTemplate;
use App\Models\ProductVariant;
use App\Support\Storefront\StorefrontProductPresenter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('storefront detail prefers variant images over shared product images', function () {
    Storage::fake('public');
    Storage::disk('public')->put('shared.jpg', 'shared');
    Storage::disk('public')->put('variant.jpg', 'variant');

    $product = Product::factory()->create(['is_active' => true]);
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
        'price' => 1000,
        'price_on_request' => false,
    ]);

    ProductImage::factory()->create([
        'product_id' => $product->id,
        'product_variant_id' => null,
        'path' => 'shared.jpg',
        'url' => null,
        'alt' => 'Shared',
        'sort_order' => 0,
    ]);

    ProductImage::factory()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'path' => 'variant.jpg',
        'url' => null,
        'alt' => 'Variant',
        'sort_order' => 0,
    ]);

    $detail = app(StorefrontProductPresenter::class)->detail(
        $product->fresh(['brand', 'category.productTemplate', 'images', 'variants.images']),
    );

    expect($detail['images'][0]['src'])->toContain('variant.jpg')
        ->and($detail['variants'][0]['images'][0]['src'])->toContain('variant.jpg');
});

test('storefront detail exposes template ordered specs', function () {
    $template = ProductTemplate::query()->where('slug', 'fragrance')->first()
        ?? ProductTemplate::factory()->create([
            'slug' => 'fragrance',
            'spec_fields' => [
                ['key' => 'scent_notes', 'label' => 'Scent notes', 'type' => 'textarea', 'position' => 1],
                ['key' => 'burn_time', 'label' => 'Burn time', 'type' => 'text', 'position' => 2],
            ],
        ]);

    $category = Category::factory()->create([
        'product_template_id' => $template->id,
    ]);

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'specs' => [
            'scent_notes' => 'Amber and oud',
            'burn_time' => '60 hours',
            'currency' => 'EUR',
        ],
    ]);

    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    $detail = app(StorefrontProductPresenter::class)->detail(
        $product->fresh(['brand', 'category.productTemplate', 'images', 'variants.images']),
    );

    expect($detail['template']['slug'])->toBe('fragrance')
        ->and($detail['specs'])->toHaveCount(2)
        ->and($detail['specs'][0])->toMatchArray([
            'key' => 'scent_notes',
            'label' => 'Scent notes',
            'value' => 'Amber and oud',
        ])
        ->and($detail['details'][0])->toBe('Scent notes: Amber and oud');
});

test('storefront template rules drive specs section title and layout', function () {
    $template = ProductTemplate::factory()->create([
        'name' => 'Jewelry',
        'rules' => [
            'pricing_mode' => 'fixed',
            'requires_brand' => true,
            'min_images' => 0,
            'storefront_specs_title' => 'Stone details',
            'specs_layout' => 'two_column',
        ],
        'spec_fields' => [
            ['key' => 'carat', 'label' => 'Carat', 'type' => 'text', 'position' => 1],
        ],
    ]);

    $category = Category::factory()->create([
        'product_template_id' => $template->id,
    ]);

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'specs' => ['carat' => '2.4'],
    ]);

    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    $detail = app(StorefrontProductPresenter::class)->detail(
        $product->fresh(['brand', 'category.productTemplate', 'images', 'variants.images']),
    );

    expect($detail['template']['rules']['storefront_specs_title'])->toBe('Stone details')
        ->and($detail['template']['rules']['specs_layout'])->toBe('two_column')
        ->and($detail['template']['name'])->toBe('Jewelry');
});

test('product page includes template and variant image payload', function () {
    Storage::fake('public');
    Storage::disk('public')->put('variant-only.jpg', 'img');

    $template = ProductTemplate::query()->where('slug', 'simple')->first()
        ?? ProductTemplate::factory()->create(['slug' => 'simple']);

    $category = Category::factory()->create([
        'product_template_id' => $template->id,
    ]);

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
    ]);

    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
        'price' => 500,
        'price_on_request' => false,
    ]);

    ProductImage::factory()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'path' => 'variant-only.jpg',
        'url' => null,
        'alt' => 'Variant',
    ]);

    $this->get(route('products.show', $product))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('product.template.slug')
            ->has('product.variants.0.images', 1)
            ->where('product.images.0.src', fn (string $src) => str_contains($src, 'variant-only.jpg')));
});
