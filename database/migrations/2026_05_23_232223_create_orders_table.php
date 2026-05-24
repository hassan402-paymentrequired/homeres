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
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('order_number')->unique();
            $table->string('status');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('shipping_total', 12, 2)->nullable();
            $table->decimal('total', 12, 2)->nullable();
            $table->boolean('has_price_on_request_items')->default(false);
            $table->string('currency', 3)->default('NGN');
            $table->timestamp('placed_at');
            $table->timestamps();

            $table->index('status');
            $table->index('placed_at');
            $table->index(['status', 'placed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
