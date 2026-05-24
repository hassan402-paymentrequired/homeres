<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('product_variants')) {
            return;
        }

        Schema::create('product_variants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->json('option_values')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->boolean('price_on_request')->default(false);
            $table->string('stock_status')->default('out_of_stock');
            $table->unsignedInteger('lead_time_days_air')->nullable();
            $table->unsignedInteger('lead_time_days_sea')->nullable();
            $table->decimal('weight_kg', 10, 3)->nullable();
            $table->unsignedInteger('quantity')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
            $table->unique(['product_id', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
