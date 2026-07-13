<?php

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

uses(RefreshDatabase::class);

beforeEach(function () {
    config([
        'site-lock.enabled' => true,
        'site-lock.password' => 'preview-secret',
        'site-lock.bypass_admin' => true,
    ]);
});

test('site is accessible when lock is disabled', function () {
    config(['site-lock.enabled' => false]);

    $this->get(route('home'))->assertOk();
    $this->get(route('checkout'))->assertOk();
});

test('site is accessible when lock is enabled without a password', function () {
    config(['site-lock.password' => null]);

    $this->get(route('home'))->assertOk();
    $this->get(route('checkout'))->assertOk();
});

test('storefront remains open while checkout is locked', function () {
    $this->get(route('home'))->assertOk();
});

test('checkout redirects visitors to the unlock page when locked', function () {
    $this->get(route('checkout'))
        ->assertRedirect(route('site-lock.show'));
});

test('unlock page is accessible while checkout is locked', function () {
    $this->get(route('site-lock.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('site-unlock'));
});

test('correct password grants access to checkout', function () {
    $this->post(route('site-lock.store'), ['password' => 'preview-secret'])
        ->assertRedirect(route('checkout'));

    $this->get(route('checkout'))->assertOk();
});

test('bcrypt password hash can be used instead of plain text', function () {
    config(['site-lock.password' => Hash::make('hashed-preview')]);

    $this->post(route('site-lock.store'), ['password' => 'hashed-preview'])
        ->assertRedirect(route('checkout'));

    $this->get(route('checkout'))->assertOk();
});

test('incorrect password is rejected', function () {
    $this->from(route('site-lock.show'))
        ->post(route('site-lock.store'), ['password' => 'wrong-password'])
        ->assertRedirect(route('site-lock.show'))
        ->assertSessionHasErrors('password');

    $this->get(route('home'))->assertOk();

    $this->get(route('checkout'))
        ->assertRedirect(route('site-lock.show'));
});

test('json checkout requests are blocked without access', function () {
    $this->getJson(route('checkout'))
        ->assertForbidden()
        ->assertJson(['message' => 'Site access required.']);
});

test('payment webhooks bypass the site lock', function () {
    $this->post(route('paystack.webhook'), [])
        ->assertStatus(400);

    $this->post(route('stripe.webhook'), [])
        ->assertStatus(400);
});

test('authenticated admins can bypass the checkout lock', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('checkout'))
        ->assertOk();
});

test('admin bypass can be disabled', function () {
    config(['site-lock.bypass_admin' => false]);

    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('checkout'))
        ->assertRedirect(route('site-lock.show'));
});

test('unlock attempts are rate limited', function () {
    RateLimiter::clear('site-lock|127.0.0.1');

    for ($attempt = 0; $attempt < 5; $attempt++) {
        $this->from(route('site-lock.show'))
            ->post(route('site-lock.store'), ['password' => 'wrong-password']);
    }

    $this->from(route('site-lock.show'))
        ->post(route('site-lock.store'), ['password' => 'wrong-password'])
        ->assertRedirect(route('site-lock.show'))
        ->assertSessionHasErrors('password');
});
