<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['status', 'total'])]
class OrderStatusStat extends Model
{
    // Bảng này dùng status làm khóa chính (không auto-increment)
    protected $primaryKey = 'status';
    public $incrementing = false;
    protected $keyType = 'string';
}
