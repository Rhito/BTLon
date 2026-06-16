<?php

namespace App\Repositories\Interfaces;

use App\Models\Order;
use App\Repositories\Base\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\CursorPaginator;

interface OrderRepositoryInterface extends EloquentRepositoryInterface
{
    public function placeAnOrder(array $attributes): Order;
    public function getPaginated(array $filters): CursorPaginator;
    public function getOrderByCodeAndEmail(array $attributes): ?Order;
    public function getValidCancelOrder(string $token): ?Order;
    public function getForExport(array $filters): Builder;
    public function countFiltered(array $filters): int;
}