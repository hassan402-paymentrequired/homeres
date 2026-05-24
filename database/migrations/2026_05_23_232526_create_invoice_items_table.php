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
        if (Schema::hasTable('invoice_items')) {
            return;
        }

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->string('variant_name');
            $table->string('sku')->nullable();
            $table->decimal('unit_price', 12, 2)->nullable();
            $table->boolean('price_on_request')->default(false);
            $table->unsignedInteger('quantity');
            $table->decimal('line_total', 12, 2)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
