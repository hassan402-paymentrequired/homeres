<?php

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admins can open the bulk product import page', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.products.import.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/products/import')
            ->has('collections'));
});
