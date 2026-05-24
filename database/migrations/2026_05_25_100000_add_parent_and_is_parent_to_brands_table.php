<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->foreignUlid('parent_id')
                ->nullable()
                ->after('id')
                ->constrained('brands')
                ->nullOnDelete();

            $table->boolean('is_parent')->default(false)->after('show_in_nav');

            $table->index(['parent_id', 'sort_order']);
            $table->index(['is_parent', 'show_in_nav', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id', 'sort_order']);
            $table->dropIndex(['is_parent', 'show_in_nav', 'is_active']);
            $table->dropColumn(['parent_id', 'is_parent']);
        });
    }
};
