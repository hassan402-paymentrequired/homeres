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
    $this->get(route('shop'))->assertOk();
    $this->get(route('checkout'))->assertOk();
});

test('site is accessible when lock is enabled without a password', function () {
    config(['site-lock.password' => null]);

    $this->get(route('home'))->assertOk();
    $this->get(route('shop'))->assertOk();
});

test('marketing pages remain open while products are locked', function () {
    $this->get(route('home'))->assertOk();
    $this->get(route('about'))->assertOk();
});

test('shop redirects visitors to the unlock page when locked', function () {
    $this->get(route('shop'))
        ->assertRedirect(route('site-lock.show'));
});

test('product pages redirect visitors to the unlock page when locked', function () {
    $this->get('/products/example-product')
        ->assertRedirect(route('site-lock.show'));
});

test('checkout redirects visitors to the unlock page when locked', function () {
    $this->get(route('checkout'))
        ->assertRedirect(route('site-lock.show'));
});

test('unlock page is accessible while products are locked', function () {
    $this->get(route('site-lock.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('site-unlock')
            ->where('siteLock.enabled', true)
            ->where('siteLock.unlocked', false));
});

test('correct password grants access to shop and flashes welcome', function () {
    $this->post(route('site-lock.store'), ['password' => 'preview-secret'])
        ->assertRedirect(route('home'))
        ->assertSessionHas('showWelcome', true);

    $this->get(route('shop'))->assertOk();
});

test('json unlock grants access without redirect', function () {
    $this->postJson(route('site-lock.store'), ['password' => 'preview-secret'])
        ->assertOk()
        ->assertJson(['unlocked' => true]);

    $this->get(route('shop'))->assertOk();
});

test('bcrypt password hash can be used instead of plain text', function () {
    config(['site-lock.password' => Hash::make('hashed-preview')]);

    $this->post(route('site-lock.store'), ['password' => 'hashed-preview'])
        ->assertRedirect(route('home'));

    $this->get(route('shop'))->assertOk();
});

test('incorrect password is rejected', function () {
    $this->from(route('site-lock.show'))
        ->post(route('site-lock.store'), ['password' => 'wrong-password'])
        ->assertRedirect(route('site-lock.show'))
        ->assertSessionHasErrors('password');

    $this->get(route('home'))->assertOk();

    $this->get(route('shop'))
        ->assertRedirect(route('site-lock.show'));
});

test('json shop requests are blocked without access', function () {
    $this->getJson(route('shop'))
        ->assertForbidden()
        ->assertJson(['message' => 'Site access required.']);
});

test('payment webhooks bypass the site lock', function () {
    $this->post(route('paystack.webhook'), [])
        ->assertStatus(400);

    $this->post(route('stripe.webhook'), [])
        ->assertStatus(400);
});

test('authenticated admins can bypass the product lock', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('shop'))
        ->assertOk();
});

test('admin bypass can be disabled', function () {
    config(['site-lock.bypass_admin' => false]);

    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('shop'))
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

test('home shares locked site lock props when enabled', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('siteLock.enabled', true)
            ->where('siteLock.unlocked', false));
});
