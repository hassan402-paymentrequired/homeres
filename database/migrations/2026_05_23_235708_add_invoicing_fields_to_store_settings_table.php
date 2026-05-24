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
        Schema::table('store_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('store_settings', 'store_name')) {
                $table->string('store_name')->nullable()->after('id');
            }

            if (! Schema::hasColumn('store_settings', 'invoice_due_days')) {
                $table->unsignedSmallInteger('invoice_due_days')->default(14)->after('default_product_status');
            }

            if (! Schema::hasColumn('store_settings', 'invoice_default_notes')) {
                $table->text('invoice_default_notes')->nullable()->after('invoice_due_days');
            }

            if (! Schema::hasColumn('store_settings', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('invoice_default_notes');
            }

            if (! Schema::hasColumn('store_settings', 'bank_account_name')) {
                $table->string('bank_account_name')->nullable()->after('bank_name');
            }

            if (! Schema::hasColumn('store_settings', 'bank_account_number')) {
                $table->string('bank_account_number')->nullable()->after('bank_account_name');
            }

            if (! Schema::hasColumn('store_settings', 'invoice_payment_instructions')) {
                $table->text('invoice_payment_instructions')->nullable()->after('bank_account_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_settings', function (Blueprint $table) {
            $columns = [
                'invoice_payment_instructions',
                'bank_account_number',
                'bank_account_name',
                'bank_name',
                'invoice_default_notes',
                'invoice_due_days',
                'store_name',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('store_settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
