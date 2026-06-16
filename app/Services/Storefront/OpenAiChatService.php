<?php

namespace App\Services\Storefront;

use App\Support\Storefront\ChatToolExecutor;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class OpenAiChatService
{
    public function __construct(
        private ChatToolExecutor $tools,
    ) {}

    public static function isConfigured(): bool
    {
        return filled(config('openai.api_key'));
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     * @return array{reply: string, products: list<array<string, mixed>>}
     */
    public function chat(array $messages): array
    {
        if (! self::isConfigured()) {
            throw new RuntimeException('AI chat is not configured.');
        }

        $conversation = [
            ['role' => 'system', 'content' => $this->systemPrompt()],
            ...$messages,
        ];

        $products = [];
        $maxRounds = (int) config('openai.max_tool_rounds', 5);

        for ($round = 0; $round < $maxRounds; $round++) {
            $response = $this->request($conversation);
            $assistantMessage = $response['choices'][0]['message'] ?? null;

            if ($assistantMessage === null) {
                throw new RuntimeException('Unexpected response from OpenAI.');
            }

            $toolCalls = $assistantMessage['tool_calls'] ?? [];

            if ($toolCalls === []) {
                return [
                    'reply' => trim((string) ($assistantMessage['content'] ?? '')),
                    'products' => $this->uniqueProducts($products),
                ];
            }

            $conversation[] = $assistantMessage;

            foreach ($toolCalls as $toolCall) {
                $name = (string) ($toolCall['function']['name'] ?? '');
                $arguments = json_decode((string) ($toolCall['function']['arguments'] ?? '{}'), true);
                $arguments = is_array($arguments) ? $arguments : [];

                $result = $this->tools->execute($name, $arguments);

                if (isset($result['products']) && is_array($result['products'])) {
                    $products = [...$products, ...$result['products']];
                }

                $conversation[] = [
                    'role' => 'tool',
                    'tool_call_id' => $toolCall['id'],
                    'content' => json_encode($result['for_ai']),
                ];
            }
        }

        return [
            'reply' => 'I found some options for you — let me know if you would like to narrow your search.',
            'products' => $this->uniqueProducts($products),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $messages
     * @return array<string, mixed>
     */
    private function request(array $messages): array
    {
        $baseUrl = rtrim((string) config('openai.base_url'), '/');

        try {
            $response = Http::withToken((string) config('openai.api_key'))
                ->timeout(60)
                ->acceptJson()
                ->post("{$baseUrl}/chat/completions", [
                    'model' => config('openai.model'),
                    'messages' => $messages,
                    'tools' => ChatToolExecutor::toolDefinitions(),
                    'tool_choice' => 'auto',
                    'temperature' => 0.4,
                ])
                ->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException(
                'Unable to reach the AI assistant right now.',
                previous: $exception,
            );
        }

        return $response->json();
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are the Homère shopping assistant for Homère Nigeria Limited, a luxury home decor boutique in Victoria Island, Lagos, Nigeria.

You help customers:
- Find products (furniture, lighting, decor, fragrances, accessories)
- Answer questions about shipping, returns, policies, the showroom, and services
- Navigate the website

Rules:
- Use search_products or get_product tools for any product recommendations — never invent products, prices, or stock.
- Use get_help_info for policy and FAQ answers — do not guess.
- You cannot place orders, modify accounts, change prices, or write data. Tell users they can add items to cart or wishlist from your suggestions, or visit product pages.
- Be warm, concise, and elegant. Keep replies under 120 words unless listing products.
- When you recommend products, briefly explain why they fit the request.
- Prices may show as "Price on request" for some luxury pieces — mention contacting the team if needed.
PROMPT;
    }

    /**
     * @param  list<array<string, mixed>>  $products
     * @return list<array<string, mixed>>
     */
    private function uniqueProducts(array $products): array
    {
        $seen = [];

        return array_values(array_filter($products, function (array $product) use (&$seen): bool {
            $id = (string) ($product['id'] ?? '');

            if ($id === '' || isset($seen[$id])) {
                return false;
            }

            $seen[$id] = true;

            return true;
        }));
    }
}
