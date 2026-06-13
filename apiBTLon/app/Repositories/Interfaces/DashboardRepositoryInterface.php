<?php

namespace App\Repositories\Interfaces;

interface DashboardRepositoryInterface
{
    public function getRevenueByPeriod(string $start, string $end): array;

    public function getOrderCountsByStatus(): array;

    public function getTopSellingProducts(int $limit = 5): array;

    public function getLowStockProducts(int $threshold = 5): array;

    public function getRevenueByDateRange(string $start, string $end): \Illuminate\Support\Collection;
}