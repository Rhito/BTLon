<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'user_id', 'old_status', 'new_status', 'note'])]
class OrderHistory extends Model
{
    // Chỉ định tên bảng vì Laravel mặc định sẽ tìm bảng số nhiều là order_histories
    protected $table = 'order_history';

    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'user_id' => 'integer',
            'old_status' => OrderStatus::class, // Ép kiểu sang Enum tự động
            'new_status' => OrderStatus::class, // Ép kiểu sang Enum tự động
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}