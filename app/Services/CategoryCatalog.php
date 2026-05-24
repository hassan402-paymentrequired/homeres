<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\File;

class CategoryCatalog
{
    /** @var array<string, int>|null */
    private static ?array $productCounts = null;

    public function productCountFor(string $handle): int
    {
        if (Product::query()->exists()) {
            return Product::query()
                ->whereHas('category', fn ($query) => $query->where('handle', $handle))
                ->count();
        }

        return $this->productCounts()[$handle] ?? 0;
    }

    /**
     * @return array<string, int>
     */
    public function productCounts(): array
    {
        if (self::$productCounts !== null) {
            return self::$productCounts;
        }

        $path = public_path('output/index.json');

        if (! File::exists($path)) {
            return self::$productCounts = [];
        }

        /** @var array{collections?: array<int, array{handle: string, product_count?: int}>} $index */
        $index = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

        self::$productCounts = collect($index['collections'] ?? [])
            ->mapWithKeys(fn (array $collection): array => [
                $collection['handle'] => (int) ($collection['product_count'] ?? 0),
            ])
            ->all();

        return self::$productCounts;
    }
}
