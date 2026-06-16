<?php

namespace App\Support\Storefront;

use App\Models\Category;
use App\Models\Product;
use App\Services\CategoryBannerSync;

final class LandingCollectionsBuilder
{
    private const CURATED = [
        [
            'handle' => 'decor-accessories',
            'label' => 'Home Decor',
            'image' => 'https://arowonen.com/cdn/shop/files/life_games_chess_052_800x_86a3fd38-e716-42ac-9314-e5e730a7508f.webp?v=1710251230&width=1080',
            'alt' => 'Curated home decor including vases, mirrors, and wall art',
        ],
        [
            'handle' => 'home-fragrance',
            'label' => 'Home Fragrances',
            'image' => '/assets/images/Baobab-collection-Gentlemen-max16.jpg',
            'alt' => 'Luxury candles and home fragrance collection',
        ],
        [
            'handle' => 'coffee-table-books-1',
            'label' => 'Books',
            'image' => '/assets/images/Book-1.jpg',
            'alt' => 'Coffee table books — design, travel, art, and luxury editions',
        ],
        [
            'handle' => 'furniture',
            'label' => 'Furniture',
            'image' => '/assets/images/home-decor.jpg',
            'alt' => 'Designer furniture including sofas, tables, and storage',
        ],
        [
            'handle' => 'lighting',
            'label' => 'Lighting',
            'image' => '/assets/images/Golden Chandelier-1.jpg',
            'alt' => 'Statement lighting including chandeliers and floor lamps',
        ],
        [
            'handle' => 'decorative-cushions-pillows',
            'label' => 'Cushions',
            'image' => 'https://arowonen.com/cdn/shop/files/imgi_4_119371_0_1_700x_8b31b312-00ff-4e25-b1a0-c9d439d83a26.webp?v=1777378944',
            'alt' => 'Decorative cushions and throw pillows',
        ],
        [
            'handle' => 'textiles',
            'label' => 'Textiles',
            'image' => 'https://arowonen.com/cdn/shop/files/IMG_6373.heic?v=1737123924',
            'alt' => 'Luxury home textiles including plaids and bedspreads',
        ],
    ];

    public function __construct(
        private StorefrontCatalogQuery $catalogQuery,
        private CategoryBannerSync $categoryBanner,
    ) {}

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
