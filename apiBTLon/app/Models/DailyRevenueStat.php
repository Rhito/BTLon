<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['date', 'total_orders', 'total_revenue', 'total_cancelled'])]
class DailyRevenueStat extends Model
{
    protected $table = 'daily_revenue_stats';

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'total_orders' => 'integer',
            'total_revenue' => 'float',
            'total_cancelled' => 'integer',
        ];
    }
}
