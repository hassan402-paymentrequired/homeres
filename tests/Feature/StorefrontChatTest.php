<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

test('chat endpoint returns service unavailable when no ai provider is configured', function () {
    config([
        'app.is_ai_local' => false,
        'openai.api_key' => null,
    ]);

    $this->postJson(route('storefront.chat'), [
        'messages' => [
            ['role' => 'user', 'content' => 'Hello'],
        ],
    ])
        ->assertServiceUnavailable()
        ->assertJson([
            'message' => 'AI assistant is not available right now.',
        ]);
});

test('chat endpoint validates messages', function () {
    config(['openai.api_key' => 'sk-test']);

    $this->postJson(route('storefront.chat'), [
        'messages' => [],
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['messages']);
});

test('chat returns assistant reply and product cards via openai', function () {
    config([
        'app.is_ai_local' => false,
        'openai.api_key' => 'sk-test',
    ]);

    $category = Category::factory()->create(['name' => 'Lighting']);
    $brand = Brand::factory()->create(['name' => 'Homère']);
    $product = Product::factory()->create([
        'name' => 'Brass Table Lamp',
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);
    ProductVariant::factory()->create([
        'product_id' => $product->id,
        'is_active' => true,
    ]);

    Http::fake([
        'api.openai.com/v1/chat/completions' => Http::sequence()
            ->push([
                'choices' => [[
                    'message' => [
                        'role' => 'assistant',
                        'content' => null,
                        'tool_calls' => [[
                            'id' => 'call_search',
                            'type' => 'function',
                            'function' => [
                                'name' => 'search_products',
                                'arguments' => json_encode([
                                    'query' => 'lamp',
                                    'limit' => 4,
                                ]),
                            ],
                        ]],
                    ],
                ]],
            ])
            ->push([
                'choices' => [[
                    'message' => [
                        'role' => 'assistant',
                        'content' => 'Here is a lamp that may suit your space.',
                    ],
                ]],
            ]),
    ]);

    $this->postJson(route('storefront.chat'), [
        'messages' => [
            ['role' => 'user', 'content' => 'Show me lamps'],
        ],
    ])
        ->assertSuccessful()
        ->assertJsonPath('reply', 'Here is a lamp that may suit your space.')
        ->assertJsonPath('products.0.id', $product->id)
        ->assertJsonPath('products.0.name', 'Brass Table Lamp');
});

test('chat returns assistant reply via ollama when local ai is enabled', function () {
    config([
        'app.is_ai_local' => true,
        'ollama.base_url' => 'http://127.0.0.1:11434',
        'ollama.model' => 'qwen2.5:3b',
        'openai.api_key' => null,
    ]);

    Http::fake([
        '127.0.0.1:11434/v1/chat/completions' => Http::response([
            'choices' => [[
                'message' => [
                    'role' => 'assistant',
                    'content' => 'Hello from Ollama.',
                ],
            ]],
        ]),
    ]);

    $this->postJson(route('storefront.chat'), [
        'messages' => [
            ['role' => 'user', 'content' => 'Hello'],
        ],
    ])
        ->assertSuccessful()
        ->assertJsonPath('reply', 'Hello from Ollama.');
});

test('storefront exposes ai chat enabled when openai is configured', function () {
    config([
        'app.is_ai_local' => false,
        'openai.api_key' => 'sk-test',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('aiChatEnabled', true));
});

test('storefront exposes ai chat enabled when ollama local ai is configured', function () {
    config([
        'app.is_ai_local' => true,
        'ollama.base_url' => 'http://127.0.0.1:11434',
        'ollama.model' => 'qwen2.5:3b',
        'openai.api_key' => null,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('aiChatEnabled', true));
});

test('admin pages do not expose ai chat', function () {
    config(['openai.api_key' => 'sk-test']);

    $this->get('/admin/login')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('aiChatEnabled', false));
});
