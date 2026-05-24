<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('product_images')) {
            Schema::create('product_images', function (Blueprint $table) {
                $table->ulid('id')->primary();
                $table->foreignUlid('product_id')->constrained()->cascadeOnDelete();
                $table->string('path')->nullable();
                $table->string('url', 2048)->nullable();
                $table->string('alt')->default('');
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();

                $table->index(['product_id', 'sort_order']);
            });
        }

        if (! Schema::hasColumn('products', 'images')) {
            return;
        }

        DB::table('products')
            ->whereNotNull('images')
            ->orderBy('id')
            ->chunkById(100, function ($products): void {
                foreach ($products as $product) {
                    /** @var array<int, array<string, mixed>>|null $images */
                    $images = json_decode((string) $product->images, true);

                    if (! is_array($images) || $images === []) {
                        continue;
                    }

                    if (DB::table('product_images')->where('product_id', $product->id)->exists()) {
                        continue;
                    }

                    foreach ($images as $position => $image) {
                        if (! is_array($image)) {
                            continue;
                        }

                        $path = filled($image['path'] ?? null) ? (string) $image['path'] : null;
                        $url = filled($image['url'] ?? null) ? (string) $image['url'] : null;

                        if ($path === null && $url === null) {
                            continue;
                        }

                        DB::table('product_images')->insert([
                            'id' => (string) Str::ulid(),
                            'product_id' => $product->id,
                            'path' => $path,
                            'url' => $url,
                            'alt' => (string) ($image['alt'] ?? ''),
                            'sort_order' => (int) ($image['position'] ?? $position),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
