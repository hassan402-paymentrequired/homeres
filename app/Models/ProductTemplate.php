<?php

namespace App\Models;

use Database\Factories\ProductTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'slug',
    'name',
    'description',
    'variant_options',
    'spec_fields',
    'rules',
    'is_system',
])]
class ProductTemplate extends Model
{
    /** @use HasFactory<ProductTemplateFactory> */
    use HasFactory, HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return HasMany<Category, $this>
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'variant_options' => 'array',
            'spec_fields' => 'array',
            'rules' => 'array',
            'is_system' => 'boolean',
        ];
    }
}
