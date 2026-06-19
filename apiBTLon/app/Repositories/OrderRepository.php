<?php

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Base\EloquentRepository;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class OrderRepository extends EloquentRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * Apply common filters to query (shared between paginated & export).
     *
     * Với 2M+ records:
     * - Dùng FULLTEXT search thay vì LIKE '%keyword%'
     * - Dùng whereBetween thay vì whereDate() để tận dụng index
     */
    private function applyFilters(Builder $query, array $filters): Builder
    {
        // Fulltext search — nhanh hơn LIKE '%..%' hàng trăm lần trên 2M+ rows
        if (!empty($filters['filter'])) {
            $search = $filters['filter'];

            // Nếu keyword là mã đơn hàng (DH-...) hoặc email/phone chính xác → exact match
            // Nếu keyword chung chung → fulltext
            if (str_starts_with(strtoupper($search), 'DH-')) {
                $query->where('order_code', $search);
            } else {
                $query->whereFullText(
                    ['order_code', 'customer_name', 'customer_email', 'customer_phone'],
                    $search
                );
            }
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Dùng whereBetween thay vì whereDate() → tận dụng được index trên created_at
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from'] . ' 00:00:00');
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        return $query;
    }

    /**
     * Phân trang bằng cursor — O(1) thay vì O(N) của offset pagination.
     *
     * @return CursorPaginator
     */
    public function getPaginated(array $filters): CursorPaginator
    {
        $query = $this->model->query();

        $this->applyFilters($query, $filters);

        // Sort
        $sortBy = $filters['sort_by'] ?? 'id';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Cursor pagination cần orderBy unique column
        // Nếu sort_by khác id, thêm secondary sort bằng id để đảm bảo deterministic order
        if ($sortBy !== 'id') {
            $query->orderBy('id', $sortOrder);
        }

        // Trashed
        match ($filters['trashed'] ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        return $query->cursorPaginate($filters['per_page'] ?? 12);
    }

    /**
     * Đếm tổng số records (cached 10 phút).
     * Trả về estimated count khi không có filter (dùng thống kê MySQL thay vì COUNT(*)).
     */
    public function countFiltered(array $filters): int
    {
        $query = $this->model->query();
        $this->applyFilters($query, $filters);

        // Trashed
        match ($filters['trashed'] ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        return $query->count();
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
        $query = $this->model
            ->where('order_code', $attributes['order_code'])
            ->where('customer_email', $attributes['customer_email']);

        // \Log::info('Find order', [
        //     'order_code' => $attributes['order_code'],
        //     'customer_email' => $attributes['customer_email'],
        //     'sql' => $query->toSql(),
        //     'bindings' => $query->getBindings(),
        // ]);

        $order = $query->first();

        // \Log::info('Order result', [
        //     'order' => $order?->toArray(),
        // ]);

        return $order;
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

        $this->applyFilters($query, $filters);

        return $query->orderBy('created_at', 'desc');
    }
}