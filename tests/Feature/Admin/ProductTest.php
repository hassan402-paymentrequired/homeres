<?php

use App\Enums\StockStatus;
use App\Models\Admin;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTemplate;
use App\Models\ProductVariant;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
    $this->category = Category::factory()->create(['handle' => 'sofas']);
    $this->brand = Brand::factory()->create(['handle' => 'flos']);
});

test('guests cannot access products admin', function () {
    $this->get(route('admin.products.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view products index', function () {
    Product::factory()->create([
        'category_id' => $this->category->id,
        'brand_id' => $this->brand->id,
        'name' => 'Miami Soft Sofa',
        'handle' => 'miami-soft-sofa',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/products/index')
            ->has('products.data', 1)
            ->where('products.per_page', 15));
});

test('admins can view a product detail page with variants', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'brand_id' => $this->brand->id,
        'handle' => 'detail-product',
    ]);
    ProductVariant::factory()->for($product)->inStore()->create(['name' => 'Default']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.products.show', $product))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/products/show')
            ->where('product.name', $product->name)
            ->has('variants.data', 1)
            ->has('stats')
            ->has('breadcrumbs'));
});

test('admins can create a product with auto-generated identifier', function () {
    Product::factory()->create(['handle' => 'existing', 'sort_order' => 2]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.store'), [
            'category_id' => $this->category->id,
            'brand_id' => $this->brand->id,
            'name' => 'Arco Floor Lamp',
            'description' => 'Iconic arc lamp',
            'status' => 'published',
        ]);

    $product = Product::query()->where('handle', 'arco-floor-lamp')->first();

    expect($product)->not->toBeNull()
        ->and($product->name)->toBe('Arco Floor Lamp')
        ->and($product->sort_order)->toBe(3);

    $response->assertRedirect(route('admin.products.show', $product));
});

test('admins can create a variant with remote stock lead times', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'remote-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.variants.store', $product), [
            'name' => 'Large / Charcoal',
            'stock_status' => StockStatus::InStockRemote->value,
            'lead_time_days_air' => '7',
            'lead_time_days_sea' => '45',
            'price' => '2500000',
            'price_on_request' => '0',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.show', $product));

    $variant = ProductVariant::query()->where('product_id', $product->id)->first();

    expect($variant)->not->toBeNull()
        ->and($variant->stock_status)->toBe(StockStatus::InStockRemote)
        ->and($variant->lead_time_days_air)->toBe(7)
        ->and($variant->lead_time_days_sea)->toBe(45);
});

test('remote stock variants require air and sea lead times', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'validation-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.products.variants.create', $product))
        ->post(route('admin.products.variants.store', $product), [
            'name' => 'Invalid variant',
            'stock_status' => StockStatus::InStockRemote->value,
            'price_on_request' => '1',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.variants.create', $product))
        ->assertSessionHasErrors(['lead_time_days_air', 'lead_time_days_sea']);
});

test('admins can update a product', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'name' => 'Old name',
        'handle' => 'old-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.products.update', $product), [
            'category_id' => $this->category->id,
            'brand_id' => $this->brand->id,
            'name' => 'Updated name',
            'status' => 'draft',
        ])
        ->assertRedirect(route('admin.products.show', $product));

    expect($product->fresh()->name)->toBe('Updated name')
        ->and($product->fresh()->handle)->toBe('old-product')
        ->and($product->fresh()->is_active)->toBeFalse();
});

test('admins can delete a product and its variants', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'delete-me',
    ]);
    ProductVariant::factory()->for($product)->create();

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    expect(Product::query()->whereKey($product->id)->exists())->toBeFalse()
        ->and(ProductVariant::query()->where('product_id', $product->id)->exists())->toBeFalse();
});

test('admins can upload product images when creating a product', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('sofa.jpg');

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.store'), [
            'category_id' => $this->category->id,
            'brand_id' => $this->brand->id,
            'name' => 'Image Product',
            'status' => 'published',
            'images' => [$file],
        ])
        ->assertRedirect();

    $product = Product::query()->where('handle', 'image-product')->first();

    expect($product)->not->toBeNull()
        ->and($product->images()->count())->toBe(1);

    $image = $product->images()->first();

    expect($image)->not->toBeNull()
        ->and($image->path)->not->toBeNull();

    Storage::disk('public')->assertExists($image->path);
});

test('product template requires brand when configured', function () {
    $template = ProductTemplate::query()->where('slug', 'simple')->firstOrFail();
    $category = Category::factory()->create([
        'product_template_id' => $template->id,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.products.create'))
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'name' => 'Brandless product',
            'status' => 'draft',
        ])
        ->assertRedirect(route('admin.products.create'))
        ->assertSessionHasErrors(['brand_id']);
});

test('product template enforces minimum image count', function () {
    $template = ProductTemplate::query()->where('slug', 'simple')->firstOrFail();
    $category = Category::factory()->create([
        'product_template_id' => $template->id,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.products.create'))
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'brand_id' => $this->brand->id,
            'name' => 'No image product',
            'status' => 'draft',
        ])
        ->assertRedirect(route('admin.products.create'))
        ->assertSessionHasErrors(['images']);
});

test('admins can delete a variant from a product', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'variant-delete-product',
    ]);
    $variant = ProductVariant::factory()->for($product)->create(['name' => 'Remove me']);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.products.variants.destroy', [$product, $variant]))
        ->assertRedirect(route('admin.products.show', $product));

    expect(ProductVariant::query()->whereKey($variant->id)->exists())->toBeFalse();
});

test('deleting a product removes its image records and files', function () {
    Storage::fake('public');

    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'handle' => 'image-cleanup-product',
    ]);

    $path = 'products/'.$product->id.'/test.jpg';
    Storage::disk('public')->put($path, 'image-data');

    $product->images()->create([
        'path' => $path,
        'url' => null,
        'alt' => 'Test',
        'sort_order' => 0,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    expect(Product::query()->whereKey($product->id)->exists())->toBeFalse();
    Storage::disk('public')->assertMissing($path);
});

test('brand product counts use the database when products exist', function () {
    Product::factory()->create([
        'category_id' => $this->category->id,
        'brand_id' => $this->brand->id,
        'handle' => 'counted-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.show', $this->brand))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats.product_count', 1)
            ->has('products.data', 1));
});
