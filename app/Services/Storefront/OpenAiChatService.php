<?php

namespace App\Services\Storefront;

use App\Support\Storefront\ChatContextPrefetcher;
use App\Support\Storefront\ChatReplySanitizer;
use App\Support\Storefront\ChatToolExecutor;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class OpenAiChatService
{
    public function __construct(
        private ChatToolExecutor $tools,
        private ChatContextPrefetcher $prefetcher,
    ) {}

    public static function isConfigured(): bool
    {
        if (self::usesLocalAi()) {
            return filled(config('ollama.base_url')) && filled(config('ollama.model'));
        }

        return filled(config('openai.api_key'));
    }

    public static function usesLocalAi(): bool
    {
        return (bool) config('app.is_ai_local', false);
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

        $prefetched = $this->prefetcher->build($messages);

        if ($prefetched !== null) {
            $conversation[] = ['role' => 'system', 'content' => $prefetched];
        }

        $products = [];
        $maxRounds = (int) config('openai.max_tool_rounds', 5);

        for ($round = 0; $round < $maxRounds; $round++) {
            $response = $this->request($conversation);
            $assistantMessage = $response['choices'][0]['message'] ?? null;

            if ($assistantMessage === null) {
                throw new RuntimeException('Unexpected response from the AI provider.');
            }

            $toolCalls = $assistantMessage['tool_calls'] ?? [];

            if ($toolCalls === []) {
                return [
                    'reply' => ChatReplySanitizer::sanitize(
                        trim((string) ($assistantMessage['content'] ?? '')),
                    ),
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
            'reply' => ChatReplySanitizer::sanitize(
                'I found some options for you — let me know if you would like to narrow your search.',
            ),
            'products' => $this->uniqueProducts($products),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $messages
     * @return array<string, mixed>
     */
    private function request(array $messages): array
    {
        return self::usesLocalAi()
            ? $this->requestOllama($messages)
            : $this->requestOpenAi($messages);
    }

    /**
     * @param  list<array<string, mixed>>  $messages
     * @return array<string, mixed>
     */
    private function requestOpenAi(array $messages): array
    {
        $baseUrl = rtrim((string) config('openai.base_url'), '/');

        try {
            $response = $this->httpClient()
                ->withToken((string) config('openai.api_key'))
                ->post("{$baseUrl}/chat/completions", [
                    'model' => config('openai.model'),
                    'messages' => $messages,
                    'tools' => ChatToolExecutor::toolDefinitions(),
                    'tool_choice' => 'auto',
                    'temperature' => 0.4,
                ])
                ->throw();
        } catch (RequestException $exception) {
            Log::error('OpenAiChatService: ' . $exception->getMessage());
            throw new RuntimeException(
                'Unable to reach the AI assistant right now.',
                previous: $exception,
            );
        }

        return $response->json();
    }

    /**
     * @param  list<array<string, mixed>>  $messages
     * @return array<string, mixed>
     */
    private function requestOllama(array $messages): array
    {
        $baseUrl = rtrim((string) config('ollama.base_url'), '/');

        try {
            $response = $this->httpClient(
                connectTimeout: (int) config('ollama.connect_timeout', 3),
                timeout: (int) config('ollama.timeout', 30),
            )
                ->post("{$baseUrl}/v1/chat/completions", [
                    'model' => config('ollama.model'),
                    'messages' => $messages,
                    'tools' => ChatToolExecutor::toolDefinitions(),
                    'tool_choice' => 'auto',
                    'temperature' => 0.4,
                    'stream' => false,
                ])
                ->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException(
                'Unable to reach the local AI assistant. Make sure Ollama is running.',
                previous: $exception,
            );
        }

        return $response->json();
    }

    private function httpClient(?int $connectTimeout = null, ?int $timeout = null): PendingRequest
    {
        $client = Http::acceptJson();

        if ($connectTimeout !== null) {
            $client = $client->connectTimeout($connectTimeout);
        }

        if ($timeout !== null) {
            $client = $client->timeout($timeout);
        } else {
            $client = $client->timeout(60);
        }

        return $client;
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are the Homère shopping assistant for Homère Nigeria Limited, a luxury home decor boutique in Victoria Island, Lagos, Nigeria.

You help customers find products and answer questions about shipping, returns, policies, the showroom, and services.

Customer-facing rules:
- Speak as a knowledgeable, warm Homère team member — never as an AI, bot, or software system.
- Never mention tools, functions, APIs, databases, lookups, prompts, or how you work internally.
- Never list internal topic keys or system capabilities. Offer help in plain, natural language.
- Before recommending products, search the catalog — never invent products, prices, or stock.
- Before answering policy or store questions, use official Homère information — do not guess.
- You cannot place orders or modify accounts. Customers can add items to cart or wishlist from your suggestions.
- Be concise and elegant. Keep replies under 120 words unless listing products.
- When you recommend products, briefly explain why they fit the request.
- Some luxury pieces show "Price on request" — mention contacting the team if needed.
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
