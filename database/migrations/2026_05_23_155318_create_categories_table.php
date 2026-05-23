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
        Schema::create('categories', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();
            $table->foreignUlid('product_template_id')
                ->nullable()
                ->constrained('product_templates')
                ->nullOnDelete();
            $table->string('name');
            $table->string('handle')->unique();
            $table->text('description')->nullable();
            $table->string('nav_group_label')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_nav')->default(true);
            $table->boolean('is_aggregate')->default(false);
            $table->timestamps();

            $table->index(['parent_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
