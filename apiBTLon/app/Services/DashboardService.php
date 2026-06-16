<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Repositories\Interfaces\DashboardRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class DashboardService
{

    public function __construct(
        protected DashboardRepositoryInterface $dashboardRepository
    ) {
    }

    public function getRevenueSummary(): array
    {
        return [
            'today' => $this->dashboardRepository->getRevenueByPeriod(
                today()->startOfDay()->toDateTimeString(),
                today()->endOfDay()->toDateTimeString(),
            ),
            'week' => $this->dashboardRepository->getRevenueByPeriod(
                now()->startOfWeek()->toDateTimeString(),
                now()->endOfWeek()->toDateTimeString(),
            ),
            'month' => $this->dashboardRepository->getRevenueByPeriod(
                now()->startOfMonth()->toDateTimeString(),
                now()->endOfMonth()->toDateTimeString(),
            ),
        ];
    }

    public function getOrdersByStatus(): array
    {
        $counts = $this->dashboardRepository->getOrderCountsByStatus();

        return collect(OrderStatus::cases())
            ->mapWithKeys(fn($status) => [
                $status->value => (int) ($counts[$status->value] ?? 0)
            ])
            ->toArray();
    }

    public function getRevenueChart(int $days = 7): array
    {
        $start = now()->subDays($days - 1)->startOfDay()->toDateTimeString();
        $end = now()->endOfDay()->toDateTimeString();

        $data = $this->dashboardRepository->getRevenueByDateRange($start, $end);

        return collect(range($days - 1, 0))
            ->map(function ($daysAgo) use ($data) {
                $date = now()->subDays($daysAgo)->toDateString();
                return [
                    'date' => $date,
                    'total_orders' => $data->get($date)?->total_orders ?? 0,
                    'revenue' => $data->get($date)?->revenue ?? 0,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Tổng hợp dashboard data.
     *
     * Vì data đã pre-computed trong stats tables, queries rất nhẹ (<5ms).
     * Cache chỉ để giảm DB round-trips khi nhiều admin cùng mở Dashboard.
     */
    public function getSummary(): array
    {
        return [
            // Revenue từ daily_revenue_stats — cực nhanh, cache ngắn
            'revenue_summary' => Cache::remember('dashboard:revenue', now()->addMinutes(2), fn() => $this->getRevenueSummary()),

            // Status counts — index scan, cache ngắn
            'orders_by_status' => Cache::remember('dashboard:status', now()->addMinutes(2), fn() => $this->getOrdersByStatus()),

            // Top selling từ product_sales_stats — cực nhanh
            'top_selling' => Cache::remember('dashboard:top', now()->addMinutes(5), fn() => $this->dashboardRepository->getTopSellingProducts()),

            // Low stock — bảng products nhỏ
            'low_stock_products' => Cache::remember('dashboard:low_stock', now()->addMinutes(5), fn() => $this->dashboardRepository->getLowStockProducts()),

            // Chart từ daily_revenue_stats — 7 rows
            'revenue_chart' => Cache::remember('dashboard:chart', now()->addMinutes(2), fn() => $this->getRevenueChart()),
        ];
    }
}