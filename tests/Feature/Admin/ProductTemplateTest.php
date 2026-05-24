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

test('guests cannot access product templates admin', function () {
    $this->get(route('admin.product-templates.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view product templates index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.product-templates.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/product-templates/index')
            ->has('templates.data', 7)
            ->where('templates.per_page', 15));
});

test('admins can create a custom product template', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product-templates.store'), [
            'name' => 'Shoes',
            'description' => 'Footwear with size and colour variants.',
            'spec_fields' => [
                [
                    'label' => 'Upper material',
                    'type' => 'text',
                    'required' => '1',
                ],
            ],
            'variant_options' => [
                [
                    'label' => 'Size',
                    'type' => 'select',
                    'required' => '1',
                    'options' => "EU 40\nEU 41\nEU 42",
                ],
            ],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => '1',
                'min_images' => '2',
            ],
        ]);

    $template = ProductTemplate::query()->where('slug', 'shoes')->first();

    expect($template)->not->toBeNull()
        ->and($template->name)->toBe('Shoes')
        ->and($template->is_system)->toBeFalse()
        ->and($template->spec_fields)->toHaveCount(1)
        ->and($template->spec_fields[0]['key'])->toBe('upper_material')
        ->and($template->variant_options[0]['options'])->toBe(['EU 40', 'EU 41', 'EU 42'])
        ->and($template->rules['min_images'])->toBe(2);

    $response->assertRedirect(route('admin.product-templates.show', $template));
});

test('admins can update a built-in product template', function () {
    $template = ProductTemplate::query()->where('slug', 'book')->firstOrFail();

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.product-templates.update', $template), [
            'name' => 'Coffee table book (updated)',
            'description' => $template->description,
            'spec_fields' => [
                [
                    'key' => 'isbn',
                    'label' => 'ISBN',
                    'type' => 'text',
                    'required' => '1',
                ],
            ],
            'variant_options' => [],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => '1',
                'min_images' => '1',
            ],
        ])
        ->assertRedirect(route('admin.product-templates.show', $template));

    $template->refresh();

    expect($template->name)->toBe('Coffee table book (updated)')
        ->and($template->slug)->toBe('book')
        ->and($template->spec_fields)->toHaveCount(1)
        ->and($template->spec_fields[0]['required'])->toBeTrue();
});

test('admins cannot delete a template linked to categories', function () {
    $template = ProductTemplate::query()->where('slug', 'simple')->firstOrFail();
    Category::factory()->create(['product_template_id' => $template->id]);

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.product-templates.show', $template))
        ->delete(route('admin.product-templates.destroy', $template))
        ->assertRedirect(route('admin.product-templates.show', $template))
        ->assertSessionHas('error');

    expect(ProductTemplate::query()->whereKey($template->id)->exists())->toBeTrue();
});

test('admins can delete an unused custom template', function () {
    $template = ProductTemplate::factory()->create([
        'slug' => 'unused-template',
        'name' => 'Unused',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.product-templates.destroy', $template))
        ->assertRedirect(route('admin.product-templates.index'));

    expect(ProductTemplate::query()->whereKey($template->id)->exists())->toBeFalse();
});

test('product template show lists linked categories', function () {
    $template = ProductTemplate::query()->where('slug', 'wallpaper')->firstOrFail();
    Category::factory()->create([
        'name' => 'Wallpaper',
        'handle' => 'wallpaper-category',
        'product_template_id' => $template->id,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.product-templates.show', $template))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/product-templates/show')
            ->where('template.name', $template->name)
            ->where('stats.categories_count', 1)
            ->has('categories.data', 1));
});
