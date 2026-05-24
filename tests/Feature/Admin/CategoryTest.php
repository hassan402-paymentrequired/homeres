<?php

use App\Models\Admin;
use App\Models\Category;
use App\Models\ProductTemplate;
use Database\Seeders\ProductTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ProductTemplateSeeder::class);
    $this->admin = Admin::factory()->create();
});

test('guests cannot access categories admin', function () {
    $this->get(route('admin.categories.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view top-level categories index as cards', function () {
    Category::factory()->create(['name' => 'Sofas', 'handle' => 'sofas', 'sort_order' => 2]);
    $furniture = Category::factory()->create(['name' => 'Furniture', 'handle' => 'furniture', 'sort_order' => 1]);
    Category::factory()->forParent($furniture)->create(['handle' => 'linear-sofas']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/categories/index')
            ->has('categories.data', 2)
            ->where('categories.data.0.name', 'Furniture')
            ->where('categories.data.0.children_count', 1)
            ->where('categories.data.1.children_count', 0)
            ->where('categories.per_page', 15)
            ->missing('categories.data.0.handle'));
});

test('category index paginates at fifteen per page', function () {
    Category::factory()->count(16)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('categories.data', 15)
            ->where('categories.total', 16)
            ->where('categories.current_page', 1));

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('categories.data', 1)
            ->where('categories.current_page', 2));
});

test('admins can view a category detail page with subcategories', function () {
    $parent = Category::factory()->create(['name' => 'Furniture', 'handle' => 'furniture']);
    Category::factory()->forParent($parent)->create(['name' => 'Sofas', 'handle' => 'sofas']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.categories.show', $parent))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/categories/show')
            ->where('category.name', 'Furniture')
            ->has('subcategories.data', 1)
            ->where('subcategories.per_page', 15)
            ->has('stats')
            ->has('breadcrumbs')
            ->missing('category.handle'));
});

test('admins can create a top-level category with auto-generated identifier', function () {
    $template = ProductTemplate::query()->where('slug', 'simple')->first();
    Category::factory()->create(['handle' => 'existing', 'sort_order' => 4]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'name' => 'Test Category',
            'product_template_id' => $template->id,
            'is_active' => '1',
            'show_in_nav' => '1',
        ]);

    $category = Category::query()->where('handle', 'test-category')->first();

    expect($category)->not->toBeNull()
        ->and($category->name)->toBe('Test Category')
        ->and($category->sort_order)->toBe(5)
        ->and($category->parent_id)->toBeNull()
        ->and($category->is_aggregate)->toBeFalse();

    $response->assertRedirect(route('admin.categories.show', $category));
});

test('duplicate category names receive unique backend identifiers', function () {
    Category::factory()->create(['name' => 'Sofas', 'handle' => 'sofas']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'name' => 'Sofas',
            'is_active' => '1',
            'show_in_nav' => '1',
        ])
        ->assertRedirect();

    expect(Category::query()->where('handle', 'sofas-2')->exists())->toBeTrue();
});

test('admins can create a subcategory from a parent detail page', function () {
    $parent = Category::factory()->create(['handle' => 'furniture']);
    $template = ProductTemplate::query()->where('slug', 'simple')->first();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.categories.store'), [
            'parent_id' => $parent->id,
            'name' => 'Sofas',
            'product_template_id' => $template->id,
            'is_active' => '1',
            'show_in_nav' => '1',
        ])
        ->assertRedirect(route('admin.categories.show', $parent));

    expect(Category::query()->where('handle', 'sofas')->value('parent_id'))->toBe($parent->id);
});

test('admins can update a category and return to its detail page', function () {
    $category = Category::factory()->create([
        'name' => 'Old name',
        'handle' => 'old-handle',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.categories.update', $category), [
            'name' => 'Updated name',
            'is_active' => '1',
            'show_in_nav' => '0',
        ])
        ->assertRedirect(route('admin.categories.show', $category));

    expect($category->fresh()->name)->toBe('Updated name')
        ->and($category->fresh()->handle)->toBe('old-handle')
        ->and($category->fresh()->show_in_nav)->toBeFalse();
});

test('admins cannot delete a category with children', function () {
    $parent = Category::factory()->create(['handle' => 'parent-cat']);
    Category::factory()->forParent($parent)->create(['handle' => 'child-cat']);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.categories.show', $parent))
        ->delete(route('admin.categories.destroy', $parent))
        ->assertRedirect(route('admin.categories.show', $parent))
        ->assertSessionHas('error');

    expect(Category::query()->whereKey($parent->id)->exists())->toBeTrue();
});

test('admins can delete a leaf category and return to its parent', function () {
    $parent = Category::factory()->create(['handle' => 'parent-cat']);
    $child = Category::factory()->forParent($parent)->create(['handle' => 'leaf-cat']);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.categories.destroy', $child))
        ->assertRedirect(route('admin.categories.show', $parent));

    expect(Category::query()->whereKey($child->id)->exists())->toBeFalse();
});

test('category seeder imports templates and categories from output index', function () {
    if (! file_exists(public_path('output/index.json'))) {
        $this->markTestSkipped('Scraped output index is not available.');
    }

    $this->seed(ProductTemplateSeeder::class);
    $this->artisan('db:seed', ['--class' => 'CategorySeeder'])->assertSuccessful();

    expect(ProductTemplate::query()->count())->toBe(7)
        ->and(Category::query()->count())->toBeGreaterThan(50)
        ->and(Category::query()->where('handle', 'furniture')->exists())->toBeTrue()
        ->and(Category::query()->where('handle', 'scented-candles')->exists())->toBeTrue();
});
