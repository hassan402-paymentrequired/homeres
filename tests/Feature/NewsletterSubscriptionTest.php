<?php

use App\Models\Admin;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use App\Support\Storefront\NewsletterPromptResolver;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('storefront can subscribe to the newsletter', function () {
    $this->postJson(route('storefront.newsletter'), [
        'email' => 'Guest@Example.com',
        'source' => 'modal',
    ])
        ->assertSuccessful()
        ->assertJson([
            'message' => 'Thank you for subscribing!',
            'already_subscribed' => false,
        ])
        ->assertCookie(NewsletterPromptResolver::SUBSCRIBED_COOKIE);

    $this->assertDatabaseHas('newsletter_subscribers', [
        'email' => 'guest@example.com',
        'source' => 'modal',
    ]);
});

test('duplicate newsletter signups are idempotent', function () {
    NewsletterSubscriber::factory()->fromModal()->create([
        'email' => 'guest@example.com',
    ]);

    $this->postJson(route('storefront.newsletter'), [
        'email' => 'guest@example.com',
        'source' => 'footer',
    ])
        ->assertSuccessful()
        ->assertJson([
            'message' => 'Thank you for subscribing!',
            'already_subscribed' => true,
        ])
        ->assertCookie(NewsletterPromptResolver::SUBSCRIBED_COOKIE);

    expect(NewsletterSubscriber::query()->count())->toBe(1);
});

test('newsletter subscription requires a valid email', function () {
    $this->postJson(route('storefront.newsletter'), [
        'email' => 'not-an-email',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('guests can dismiss the newsletter prompt', function () {
    $this->postJson(route('storefront.newsletter.dismiss'))
        ->assertSuccessful()
        ->assertCookie(NewsletterPromptResolver::NEXT_PROMPT_COOKIE);
});

test('dismiss defers the newsletter prompt for three hours', function () {
    $this->postJson(route('storefront.newsletter.dismiss'))
        ->assertSuccessful()
        ->assertCookie(NewsletterPromptResolver::NEXT_PROMPT_COOKIE);
});

test('newsletter modal is hidden within the three hour cooldown', function () {
    $nextPromptAt = now()->addHours(2)->timestamp;

    $this->withUnencryptedCookie(
        NewsletterPromptResolver::NEXT_PROMPT_COOKIE,
        (string) $nextPromptAt,
    )
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('showNewsletterModal', false));
});

test('newsletter modal can show again after the three hour cooldown', function () {
    $nextPromptAt = now()->subHour()->timestamp;

    $this->withUnencryptedCookie(
        NewsletterPromptResolver::NEXT_PROMPT_COOKIE,
        (string) $nextPromptAt,
    )
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('showNewsletterModal', true));
});

test('newsletter modal stays hidden after subscribing on the device', function () {
    $this->withUnencryptedCookie(NewsletterPromptResolver::SUBSCRIBED_COOKIE, '1')
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('showNewsletterModal', false));
});

test('newsletter modal is hidden for authenticated subscribers', function () {
    $user = User::factory()->create([
        'email' => 'member@example.com',
    ]);

    NewsletterSubscriber::factory()->create([
        'email' => 'member@example.com',
        'user_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('showNewsletterModal', false));
});

test('newsletter modal is hidden when guest email exists in subscribers', function () {
    NewsletterSubscriber::factory()->create([
        'email' => 'member@example.com',
    ]);

    $user = User::factory()->create([
        'email' => 'member@example.com',
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('showNewsletterModal', false));
});

test('registration links an existing newsletter subscriber to the new user', function () {
    NewsletterSubscriber::factory()->create([
        'email' => 'member@example.com',
        'user_id' => null,
    ]);

    $user = User::factory()->create([
        'email' => 'member@example.com',
    ]);

    app(NewsletterPromptResolver::class)->linkSubscriberToUser($user);

    expect(NewsletterSubscriber::query()->first())
        ->user_id->toBe($user->id);
});

test('authenticated newsletter signups are linked to the user account', function () {
    $user = User::factory()->create([
        'email' => 'member@example.com',
    ]);

    $this->actingAs($user)
        ->postJson(route('storefront.newsletter'), [
            'email' => 'member@example.com',
            'source' => 'footer',
        ])
        ->assertSuccessful();

    expect(NewsletterSubscriber::query()->first())
        ->user_id->toBe($user->id);
});

test('guests cannot access newsletter subscribers admin', function () {
    $this->get(route('admin.newsletter-subscribers.index'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view newsletter subscribers index', function () {
    $admin = Admin::factory()->create();
    $subscriber = NewsletterSubscriber::factory()->fromFooter()->create([
        'email' => 'subscriber@example.com',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.newsletter-subscribers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/newsletter-subscribers/index')
            ->has('subscribers.data', 1)
            ->where('subscribers.data.0.email', $subscriber->email)
            ->where('subscribers.data.0.source', 'footer')
            ->where('stats.total', 1)
            ->where('stats.from_footer', 1)
            ->where('stats.from_modal', 0));
});
