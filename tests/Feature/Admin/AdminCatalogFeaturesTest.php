<?php

use App\Enums\StockStatus;
use App\Models\Admin;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTemplate;
use App\Models\ProductVariant;
use App\Models\StoreSetting;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
});

test('template-driven variants auto-build the variant name from options', function () {
    $template = ProductTemplate::query()->where('slug', 'wallpaper')->firstOrFail();
    $category = Category::factory()->create([
        'handle' => 'wallpaper',
        'product_template_id' => $template->id,
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'handle' => 'wallpaper-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.products.variants.store', $product), [
            'option_values' => ['color' => 'Ivory'],
            'stock_status' => StockStatus::InStore->value,
            'price' => '150000',
            'price_on_request' => '0',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.show', $product));

    $variant = ProductVariant::query()->where('product_id', $product->id)->first();

    expect($variant)->not->toBeNull()
        ->and($variant->name)->toBe('Ivory')
        ->and($variant->option_values)->toBe(['color' => 'Ivory']);
});

test('required template variant options are validated', function () {
    $template = ProductTemplate::query()->where('slug', 'wallpaper')->firstOrFail();
    $category = Category::factory()->create([
        'handle' => 'wallpaper-required',
        'product_template_id' => $template->id,
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'handle' => 'wallpaper-required-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.products.variants.create', $product))
        ->post(route('admin.products.variants.store', $product), [
            'option_values' => ['color' => ''],
            'stock_status' => StockStatus::InStore->value,
            'price_on_request' => '1',
            'is_active' => '1',
        ])
        ->assertRedirect(route('admin.products.variants.create', $product))
        ->assertSessionHasErrors(['option_values.color']);
});

test('category show lists paginated products', function () {
    $category = Category::factory()->create(['handle' => 'listed-category']);
    $brand = Brand::factory()->create();
    Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'name' => 'Listed product',
        'handle' => 'listed-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.show', $category))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Listed product'));
});

test('brand show lists paginated products when they exist', function () {
    $category = Category::factory()->create();
    $brand = Brand::factory()->create(['handle' => 'listed-brand']);
    Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'name' => 'Brand product',
        'handle' => 'brand-product',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.brands.show', $brand))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Brand product'));
});

test('dashboard exposes catalog stats', function () {
    $category = Category::factory()->create();
    Brand::factory()->count(2)->create();
    Product::factory()->count(2)->create([
        'category_id' => $category->id,
        'brand_id' => null,
        'is_active' => false,
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => null,
        'is_active' => true,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats.categories_count', 1)
            ->where('stats.brands_count', 2)
            ->where('stats.products_count', 3)
            ->where('stats.draft_products_count', 2));
});

test('admins can update store settings', function () {
    StoreSetting::current();

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.settings.update'), [
            'store_name' => 'Homère Lagos',
            'contact_email' => 'hello@homere.com',
            'contact_phone' => '+2348000000000',
            'default_product_status' => 'published',
            'invoice_due_days' => 21,
            'invoice_default_notes' => 'Payment due within 21 days.',
            'invoice_payment_instructions' => 'Use order number as payment reference.',
        ])
        ->assertRedirect(route('admin.settings.edit'));

    expect(StoreSetting::current())
        ->store_name->toBe('Homère Lagos')
        ->contact_email->toBe('hello@homere.com')
        ->contact_phone->toBe('+2348000000000')
        ->default_product_status->toBe('published')
        ->invoice_due_days->toBe(21)
        ->invoice_payment_instructions->toBe('Use order number as payment reference.');
});

test('catalog import command imports products from scraped collections', function () {
    $category = Category::factory()->create(['handle' => 'sofas']);
    $brand = Brand::factory()->create([
        'handle' => 'baxter-made-in-italy',
        'name' => 'Baxter Made in Italy',
    ]);

    $this->artisan('catalog:import-products', [
        '--collection' => 'sofas',
        '--limit' => 1,
    ])->assertSuccessful();

    $product = Product::query()->first();

    expect($product)->not->toBeNull()
        ->and($product->category_id)->toBe($category->id)
        ->and($product->brand_id)->toBe($brand->id)
        ->and($product->variants()->count())->toBeGreaterThan(0)
        ->and($product->images()->count())->toBeGreaterThan(0);
});
