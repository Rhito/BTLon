<?php

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Repositories\Interfaces\DashboardRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Override;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getRevenueByPeriod(string $start, string $end): array
    {
        $query = Order::where('status', OrderStatus::DELIVERED)
            ->whereBetween('created_at', [$start, $end]);

        return [
            'total_orders' => (clone $query)->count(),
            'revenue' => (clone $query)->sum('total_amount'),
        ];
    }

    public function getOrderCountsByStatus(): array
    {
        return Order::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }

    public function getTopSellingProducts(int $limit = 5): array
    {
        return DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', OrderStatus::DELIVERED->value)
            ->select(
                'products.id',
                'products.name',
                'products.stock',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue'),
            )
            ->groupBy('products.id', 'products.name', 'products.stock')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getLowStockProducts(int $threshold = 5): array
    {
        return Product::where('stock', '<=', $threshold)
            ->where('stock', '>', 0)
            ->orderBy('stock')
            ->get(['id', 'name', 'stock', 'slug'])
            ->toArray();
    }

    public function getRevenueByDateRange(string $start, string $end): \Illuminate\Support\Collection
    {
        return Order::where('status', OrderStatus::DELIVERED)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_amount) as revenue'),
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
    }
}