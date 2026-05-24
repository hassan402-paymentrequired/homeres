<?php

namespace App\Support\Storefront;

use App\Models\Category;
use App\Models\Product;
use App\Services\CategoryBannerSync;

final class LandingCollectionsBuilder
{
    /**
     * Curated storefront categories for the home page grid (correct DB handles).
     * Visual assets are kept from the original landing design.
     *
     * @var list<array{
     *     handle: string,
     *     label: string,
     *     image: string,
     *     alt: string,
     * }>
     */
    private const CURATED = [
        [
            'handle' => 'decor-accessories',
            'label' => 'Home Decor',
            'image' => '/assets/images/Sitting-white-Mickey.jpg',
            'alt' => 'Curated home decor including vases, mirrors, and wall art',
        ],
        [
            'handle' => 'home-fragrance',
            'label' => 'Home Fragrances',
            'image' => 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
            'alt' => 'Luxury candles and home fragrance collection',
        ],
        [
            'handle' => 'objects',
            'label' => 'Home Accessories',
            'image' => '/assets/images/Globo tray 2.jpg',
            'alt' => 'Decorative bowls, trays, cushions, and accessories',
        ],
        [
            'handle' => 'furniture',
            'label' => 'Furniture',
            'image' => '/assets/images/Trolley Bellini.jpg',
            'alt' => 'Designer furniture including sofas, tables, and storage',
        ],
        [
            'handle' => 'lighting',
            'label' => 'Lighting',
            'image' => '/assets/images/Golden Chandelier-1.jpg',
            'alt' => 'Statement lighting including chandeliers and floor lamps',
        ],
        // [
        //     'handle' => 'flowers-vases',
        //     'label' => 'Flowers & Vases',
        //     'image' => '/assets/images/banners/RNI-Films-IMG-17222E29-7C9D-4AA4-B607-37D6B87427D0.JPG',
        //     'alt' => 'Floral arrangements, vases, and botanical decor',
        // ],
    ];

    public function __construct(
        private StorefrontCatalogQuery $catalogQuery,
        private CategoryBannerSync $categoryBanner,
    ) {}

    /**
     * @return list<array{
     *     id: string,
     *     name: string,
     *     slug: string,
     *     image: string,
     *     alt: string,
     *     productCount: int,
     * }>
     */
    public function build(): array
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->get(['id', 'handle', 'name', 'banner_path', 'banner_url'])
            ->keyBy('handle');

        $collections = [];

        foreach (self::CURATED as $entry) {
            $handle = $entry['handle'];
            $category = $categories->get($handle);

            if ($category === null) {
                continue;
            }

            $productCount = $this->publishedProductCount($handle);

            if ($productCount === 0) {
                continue;
            }

            $collections[] = [
                'id' => $category->id,
                'name' => $entry['label'],
                'slug' => $handle,
                'image' => $this->categoryBanner->publicUrl($category) ?? $entry['image'],
                'alt' => $entry['alt'],
                'productCount' => $productCount,
            ];
        }

        return $collections;
    }

    private function publishedProductCount(string $handle): int
    {
        $categoryIds = $this->catalogQuery->categoryIdsForHandle($handle);

        if ($categoryIds->isEmpty()) {
            return 0;
        }

        return Product::query()
            ->published()
            ->whereIn('category_id', $categoryIds)
            ->count();
    }
}
