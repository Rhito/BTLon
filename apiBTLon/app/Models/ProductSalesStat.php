<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'total_sold', 'total_revenue'])]
class ProductSalesStat extends Model
{
    protected $table = 'product_sales_stats';

    protected function casts(): array
    {
        return [
            'total_sold' => 'integer',
            'total_revenue' => 'float',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
