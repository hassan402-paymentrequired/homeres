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
        if (Schema::hasTable('invoices')) {
            return;
        }

        Schema::create('invoices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignUlid('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_state')->nullable();
            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('shipping_total', 12, 2)->nullable();
            $table->decimal('total', 12, 2)->nullable();
            $table->boolean('has_price_on_request_items')->default(false);
            $table->string('currency', 3)->default('NGN');
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('order_id');
            $table->index('issued_at');
            $table->index(['status', 'issued_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
