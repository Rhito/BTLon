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
                    'total_orders' => $data[$date]->total_orders ?? 0,
                    'revenue' => $data[$date]->revenue ?? 0,
                ];
            })
            ->values()
            ->toArray();
    }

    public function getSummary(): array
    {
        return Cache::remember('dashboard:summary', now()->addMinutes(5), function () {
            return [
                'revenue_summary' => $this->getRevenueSummary(),
                'orders_by_status' => $this->getOrdersByStatus(),
                'top_selling' => $this->dashboardRepository->getTopSellingProducts(),
                'low_stock_products' => $this->dashboardRepository->getLowStockProducts(),
                'revenue_chart' => $this->getRevenueChart(),
            ];
        });
    }
}