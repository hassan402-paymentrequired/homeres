<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StoreSetting;
use App\Notifications\AdminNewOrderNotification;
use App\Notifications\CustomerOrderConfirmationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function checkoutNotificationPayload(ProductVariant $variant): array
{
    return [
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
        'customer_phone' => '+2348000000000',
        'shipping_address' => '12 Marina',
        'shipping_city' => 'Lagos',
        'shipping_state' => 'Lagos',
        'items' => [
            ['variant_id' => $variant->id, 'quantity' => 1],
        ],
    ];
}

function createCheckoutVariantForNotifications(): ProductVariant
{
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);

    return ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 250000,
        'price_on_request' => false,
        'is_active' => true,
    ]);
}

test('checkout sends order confirmation emails to customer and admin', function () {
    Notification::fake();

    StoreSetting::current()->update([
        'contact_email' => 'orders@homere.com',
    ]);

    $variant = createCheckoutVariantForNotifications();

    $this->post(route('checkout.store'), checkoutNotificationPayload($variant))
        ->assertRedirect();

    Notification::assertSentOnDemand(
        CustomerOrderConfirmationNotification::class,
        fn (CustomerOrderConfirmationNotification $notification, array $channels, object $notifiable) => ($notifiable->routes['mail'] ?? null) === 'ada@example.com',
    );

    Notification::assertSentOnDemand(
        AdminNewOrderNotification::class,
        fn (AdminNewOrderNotification $notification, array $channels, object $notifiable) => ($notifiable->routes['mail'] ?? null) === 'orders@homere.com',
    );
});

test('checkout skips admin notification when no admin email is configured', function () {
    Notification::fake();

    StoreSetting::current()->update([
        'contact_email' => null,
    ]);

    config(['mail.order_admin' => null]);

    $variant = createCheckoutVariantForNotifications();

    $this->post(route('checkout.store'), checkoutNotificationPayload($variant))
        ->assertRedirect();

    Notification::assertSentOnDemand(CustomerOrderConfirmationNotification::class);
    Notification::assertSentOnDemandTimes(AdminNewOrderNotification::class, 0);
});
