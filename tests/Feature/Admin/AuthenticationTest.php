<?php

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin login screen can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
});

test('admins can authenticate using the admin portal', function () {
    $admin = Admin::factory()->create();

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($admin, 'admin');
    $response->assertRedirect(route('admin.dashboard'));
});

test('admins can not authenticate with invalid password', function () {
    $admin = Admin::factory()->create();

    $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest('admin');
});

test('admins can logout', function () {
    $admin = Admin::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.logout'));

    $this->assertGuest('admin');
    $response->assertRedirect(route('admin.login'));
});

test('guests are redirected to admin login when visiting dashboard', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});

test('authenticated admins can visit the dashboard', function () {
    $admin = Admin::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->get(route('admin.dashboard'));

    $response->assertOk();
});

test('authenticated admins can visit module placeholder pages', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.categories.index'))
        ->assertOk();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.brands.index'))
        ->assertOk();
});

test('storefront users cannot access admin dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});
