<?php

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Base\EloquentRepository;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class OrderRepository extends EloquentRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * Summary of getPaginated
     * @param array $filters
     * @return LengthAwarePaginator<int, \Illuminate\Database\Eloquent\Model>
     */
    public function getPaginated(
        array $filters
    ): LengthAwarePaginator {
        $query = $this->model->query();

        // Filter
        if (!empty($filters['filter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('order_code', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('customer_email', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('customer_name', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('customer_phone', 'like', '%' . $filters['filter'] . '%');
            });
        }

        // Status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Sort
        $query->orderBy(
            $filters['sort_by'] ?? 'id',
            $filters['sort_order'] ?? 'desc'
        );

        // Date range filter
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Trashed
        match ($filters['trashed'] ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        return $query->paginate($filters['per_page'] ?? 12);
    }

    public function placeAnOrder(array $attributes): Order
    {
        $orderData = Arr::except($attributes, ['items']);
        $itemsData = Arr::get($attributes, 'items', []);

        $order = $this->model->create($orderData);

        if (!empty($itemsData)) {
            $order->orderItems()->createMany($itemsData);
        }

        return $order->load('orderItems');
    }

    public function getOrderByCodeAndEmail(array $attributes): ?Order
    {
        return $this->model->where('order_code', $attributes['order_code'])
            ->where('customer_email', $attributes['customer_email'])
            ->first();
    }

    public function getValidCancelOrder(string $token): ?Order
    {
        return $this->model->where('cancel_token', $token)
            ->where('cancel_token_expires_at', '>', Carbon::now())
            ->first();
    }

    public function getForExport(array $filters): Builder
    {
        $query = $this->model->query();

        if (!empty($filters['filter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('order_code', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('customer_email', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('customer_name', 'like', '%' . $filters['filter'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('created_at', 'desc');
    }
}