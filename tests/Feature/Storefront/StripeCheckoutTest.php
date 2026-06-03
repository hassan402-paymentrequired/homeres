<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

function createCheckoutProductVariant(float $price = 100): ProductVariant
{
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
        'specs' => ['currency' => 'EUR'],
    ]);

    return ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => $price,
        'price_on_request' => false,
        'is_active' => true,
    ]);
}

function checkoutPayload(
    ProductVariant $variant,
    int $quantity = 2,
    string $paymentProvider = 'paystack',
): array {
    return [
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
        'customer_phone' => '+2348000000000',
        'shipping_address' => '12 Marina',
        'shipping_city' => 'Lagos',
        'shipping_state' => 'Lagos',
        'customer_note' => 'Please call on arrival.',
        'payment_provider' => $paymentProvider,
        'items' => [
            ['variant_id' => $variant->id, 'quantity' => $quantity],
        ],
    ];
}

test('checkout creates an ngn order from cart payload', function () {
    config([
        'storefront.exchange_rates.EUR.NGN' => 1000,
        'paystack.secret_key' => null,
    ]);

    $variant = createCheckoutProductVariant();

    $this->withHeader('CF-IPCountry', 'NG')
        ->post(route('checkout.store'), checkoutPayload($variant))
        ->assertRedirect();

    $order = Order::query()->first();

    expect($order)->not->toBeNull()
        ->and($order->customer_name)->toBe('Ada Lovelace')
        ->and($order->user_id)->toBeNull()
        ->and($order->status)->toBe(OrderStatus::Pending)
        ->and($order->payment_status)->toBe(PaymentStatus::Pending)
        ->and($order->currency)->toBe('NGN')
        ->and((float) $order->total)->toBe(200000.0)
        ->and($order->items)->toHaveCount(1);
});

test('usd checkout redirects to stripe when configured', function () {
    config([
        'storefront.exchange_rates.EUR.USD' => 2,
        'stripe.secret_key' => 'sk_test_example',
    ]);

    Http::fake([
        'api.stripe.com/v1/checkout/sessions' => Http::response([
            'id' => 'cs_test_123',
            'url' => 'https://checkout.stripe.com/pay/cs_test_123',
        ], 200),
    ]);

    $variant = createCheckoutProductVariant(50);

    $response = $this->withHeader('CF-IPCountry', 'US')
        ->post(route('checkout.store'), checkoutPayload($variant, 1, 'stripe'));

    $order = Order::query()->first();

    expect($order)->not->toBeNull()
        ->and($order->currency)->toBe('USD')
        ->and((float) $order->total)->toBe(100.0)
        ->and($order->stripe_session_id)->toBe('cs_test_123');

    $response->assertRedirect('https://checkout.stripe.com/pay/cs_test_123');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.stripe.com/v1/checkout/sessions'
            && $request['line_items[0][price_data][currency]'] === 'usd'
            && $request['line_items[0][price_data][unit_amount]'] === 10000;
    });
});

test('buyers outside nigeria can choose paystack for ngn checkout', function () {
    config([
        'storefront.exchange_rates.EUR.NGN' => 1000,
        'paystack.secret_key' => null,
    ]);

    $variant = createCheckoutProductVariant();

    $this->withHeader('CF-IPCountry', 'US')
        ->post(route('checkout.store'), checkoutPayload($variant, 1, 'paystack'))
        ->assertRedirect();

    $order = Order::query()->first();

    expect($order->currency)->toBe('NGN')
        ->and((float) $order->total)->toBe(100000.0);
});

test('stripe callback marks order as paid', function () {
    config(['stripe.secret_key' => 'sk_test_example']);

    $order = Order::factory()->create([
        'currency' => 'USD',
        'total' => 100,
        'payment_status' => PaymentStatus::Pending,
    ]);

    Http::fake([
        'api.stripe.com/v1/checkout/sessions/*' => Http::response([
            'id' => 'cs_test_123',
            'payment_status' => 'paid',
            'payment_intent' => 'pi_test_123',
            'metadata' => [
                'order_id' => $order->id,
            ],
        ], 200),
    ]);

    $this->get(route('checkout.stripe.callback', ['session_id' => 'cs_test_123']))
        ->assertRedirect(route('checkout.complete', $order));

    $order->refresh();

    expect($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->status)->toBe(OrderStatus::Confirmed)
        ->and($order->stripe_session_id)->toBe('cs_test_123')
        ->and($order->stripe_payment_intent_id)->toBe('pi_test_123');
});

test('stripe webhook marks order as paid', function () {
    config(['stripe.webhook_secret' => 'whsec_test']);

    $order = Order::factory()->create([
        'currency' => 'USD',
        'total' => 250,
        'payment_status' => PaymentStatus::Pending,
    ]);

    $payload = json_encode([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test_webhook',
                'payment_status' => 'paid',
                'payment_intent' => 'pi_test_webhook',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ],
        ],
    ], JSON_THROW_ON_ERROR);

    $timestamp = time();
    $signature = hash_hmac('sha256', $timestamp.'.'.$payload, 'whsec_test');

    $this->call(
        'POST',
        route('stripe.webhook'),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => 't='.$timestamp.',v1='.$signature,
        ],
        $payload,
    )->assertOk();

    $order->refresh();

    expect($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->stripe_session_id)->toBe('cs_test_webhook');
});
