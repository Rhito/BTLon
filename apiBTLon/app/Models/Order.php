<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'order_code',
    'customer_name',
    'customer_email',
    'customer_phone',
    'customer_address',
    'note',
    'payment_method',
    'total_amount',
    'status',
    'cancel_reason',
    'cancel_token',
    'cancel_token_expires_at',
]
)]
#[ObservedBy(OrderObserver::class)]
class Order extends Model
{
    use SoftDeletes;
    protected function casts(): array
    {
        return [
            'total_amount' => 'float',
            'status' => OrderStatus::class,
        ];
    }
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
