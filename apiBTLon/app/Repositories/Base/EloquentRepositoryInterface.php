<?php

namespace App\Repositories\Base;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface EloquentRepositoryInterface
{
    public function all(array $column = ['*'], array $relataions = []): Collection;

    public function paginate(int $perPage = 12, array $column = ['*'], array $relations = []): LengthAwarePaginator;

    public function find(int $id, array $columns = ['*'], array $relations = [], $trashed = null): ?Model;

    public function create(array $attributes): Model;

    public function update(int $id, array $attributes): bool;

    public function delete(int $id): bool;

    public function forceDelete(int $id): bool;
    public function restore(int $id): bool;
}