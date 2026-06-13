<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Base\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryRepositoryInterface extends EloquentRepositoryInterface
{
    public function findBySlug(string $slug): ?Model;
    public function getPaginated(array $filters): LengthAwarePaginator;
    public function countProducts(string $slug): ?int;
}