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
            foreach (['bank_account_number', 'bank_account_name', 'bank_name'] as $column) {
                if (Schema::hasColumn('store_settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('store_settings', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('invoice_default_notes');
            }

            if (! Schema::hasColumn('store_settings', 'bank_account_name')) {
                $table->string('bank_account_name')->nullable()->after('bank_name');
            }

            if (! Schema::hasColumn('store_settings', 'bank_account_number')) {
                $table->string('bank_account_number')->nullable()->after('bank_account_name');
            }
        });
    }
};
