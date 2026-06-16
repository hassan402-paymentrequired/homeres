<?php

namespace App\Support\Storefront;

use App\Models\Product;
use Illuminate\Support\Collection;

final class ChatToolExecutor
{
    public function __construct(
        private StorefrontCatalogQuery $catalog,
        private StorefrontProductPresenter $presenter,
    ) {}

    /**
     * @param  array<string, mixed>  $arguments
     * @return array{for_ai: mixed, products?: list<array<string, mixed>>}
     */
    public function execute(string $name, array $arguments): array
    {
        return match ($name) {
            'search_products' => $this->searchProducts($arguments),
            'get_product' => $this->getProduct($arguments),
            'get_help_info' => $this->getHelpInfo($arguments),
            default => [
                'for_ai' => ['error' => 'Unknown tool.'],
            ],
        };
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function toolDefinitions(): array
    {
        $helpTopics = implode(', ', ChatHelpKnowledge::topicKeys());

        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'search_products',
                    'description' => 'Search the Homère catalog for products by keyword, name, brand, or description.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'query' => [
                                'type' => 'string',
                                'description' => 'Search terms, e.g. lamp, candle, chandelier, sofa',
                            ],
                            'limit' => [
                                'type' => 'integer',
                                'description' => 'Max results (1-6)',
                            ],
                        ],
                        'required' => ['query'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_product',
                    'description' => 'Get details for a specific product by its ID from a prior search.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'product_id' => [
                                'type' => 'string',
                                'description' => 'The product ID',
                            ],
                        ],
                        'required' => ['product_id'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_help_info',
                    'description' => 'Get official Homère policy and store information. Topics: '.$helpTopics,
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'topic' => [
                                'type' => 'string',
                                'enum' => ChatHelpKnowledge::topicKeys(),
                            ],
                        ],
                        'required' => ['topic'],
                    ],
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array{for_ai: mixed, products: list<array<string, mixed>>}
     */
    private function searchProducts(array $arguments): array
    {
        $query = trim((string) ($arguments['query'] ?? ''));

        if ($query === '') {
            return [
                'for_ai' => ['products' => [], 'message' => 'No search query provided.'],
                'products' => [],
            ];
        }

        $limit = min(max((int) ($arguments['limit'] ?? 4), 1), 6);

        $products = $this->catalog
            ->build(['q' => $query])
            ->limit($limit)
            ->get();

        $cards = $this->presenter->cards($products);

        return [
            'for_ai' => [
                'count' => count($cards),
                'products' => $this->summarizeForAi($products, $cards),
            ],
            'products' => $cards,
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array{for_ai: mixed, products: list<array<string, mixed>>}
     */
    private function getProduct(array $arguments): array
    {
        $productId = trim((string) ($arguments['product_id'] ?? ''));

        $product = Product::query()
            ->published()
            ->with(['brand', 'category', 'images', 'variants.images'])
            ->find($productId);

        if ($product === null) {
            return [
                'for_ai' => ['error' => 'Product not found.'],
                'products' => [],
            ];
        }

        $detail = $this->presenter->detail($product);
        $card = $this->presenter->card($product);

        return [
            'for_ai' => [
                'product' => [
                    'id' => $detail['id'],
                    'name' => $detail['name'],
                    'brand' => $detail['brand'],
                    'category' => $detail['category'],
                    'price' => $detail['priceFormatted'],
                    'price_on_request' => $detail['priceOnRequest'],
                    'description' => mb_substr(strip_tags((string) $detail['description']), 0, 500),
                    'in_stock' => collect($detail['variants'] ?? [])
                        ->contains(fn (array $variant): bool => ($variant['stockStatus'] ?? '') !== 'out_of_stock'),
                ],
            ],
            'products' => [$card],
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array{for_ai: mixed}
     */
    private function getHelpInfo(array $arguments): array
    {
        $topic = (string) ($arguments['topic'] ?? '');
        $content = ChatHelpKnowledge::forTopic($topic);

        if ($content === null) {
            return [
                'for_ai' => [
                    'error' => 'Unknown help topic.',
                    'available_topics' => ChatHelpKnowledge::topicKeys(),
                ],
            ];
        }

        return [
            'for_ai' => [
                'topic' => $topic,
                'content' => $content,
            ],
        ];
    }

    /**
     * @param  Collection<int, Product>  $products
     * @param  list<array<string, mixed>>  $cards
     * @return list<array<string, mixed>>
     */
    private function summarizeForAi(Collection $products, array $cards): array
    {
        return $products->values()->map(function (Product $product, int $index) use ($cards): array {
            $card = $cards[$index] ?? [];

            return [
                'id' => $product->id,
                'name' => $card['name'] ?? $product->name,
                'brand' => $card['brand'] ?? '',
                'category' => $card['category'] ?? '',
                'price' => $card['priceFormatted'] ?? '',
                'price_on_request' => $card['priceOnRequest'] ?? false,
                'url' => $card['href'] ?? '',
            ];
        })->all();
    }
}
