<?php

namespace App\Enums;

enum StockStatus: string
{
    case InStore = 'in_store';
    case InStockRemote = 'in_stock_remote';
    case OutOfStock = 'out_of_stock';

    public function label(): string
    {
        return match ($this) {
            self::InStore => 'In store',
            self::InStockRemote => 'In stock (remote)',
            self::OutOfStock => 'Out of stock',
        };
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
