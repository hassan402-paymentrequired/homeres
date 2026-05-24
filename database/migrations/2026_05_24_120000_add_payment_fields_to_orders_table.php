<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->default('pending')->after('status');
            }

            if (! Schema::hasColumn('orders', 'paystack_reference')) {
                $table->string('paystack_reference')->nullable()->after('payment_status');
            }

            if (! Schema::hasColumn('orders', 'paystack_transaction_id')) {
                $table->string('paystack_transaction_id')->nullable()->after('paystack_reference');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            foreach (['paystack_transaction_id', 'paystack_reference', 'payment_status'] as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
