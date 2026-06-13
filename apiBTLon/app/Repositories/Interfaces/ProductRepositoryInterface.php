<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Base\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface extends EloquentRepositoryInterface
{
    public function findBySlug(string $slug, array $relation = []): ?Model;
    public function getPaginated(array $filters): LengthAwarePaginator;
}