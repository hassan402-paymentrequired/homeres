<?php

namespace App\Models;

use App\Enums\StockStatus;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'order_id',
    'product_id',
    'product_variant_id',
    'product_name',
    'variant_name',
    'sku',
    'stock_status',
    'unit_price',
    'price_on_request',
    'quantity',
    'line_total',
    'sort_order',
])]
class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory, HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<ProductVariant, $this>
     */
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stock_status' => StockStatus::class,
            'unit_price' => 'decimal:2',
            'price_on_request' => 'boolean',
            'line_total' => 'decimal:2',
        ];
    }
}
