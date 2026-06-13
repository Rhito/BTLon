<?php

namespace App\Repositories\Base;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class EloquentRepository implements EloquentRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*'], array $relataions = []): Collection
    {
        return $this->model->with($relataions)->get($columns);
    }

    public function paginate(int $perPage = 12, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->model->with($relations)->paginate($perPage, $columns);
    }

    public function find(int $id, array $columns = ['*'], array $relations = [], $trashed = null): ?Model
    {
        $query = $this->model->with($relations);
        match ($trashed ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };
        return $query->find($id, $columns);
    }

    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    public function update(int $id, array $attributes): bool
    {
        $record = $this->find($id);
        if ($record) {
            return $record->update($attributes);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $record = $this->find($id);
        if ($record) {
            return $record->delete();
        }

        return false;
    }

    public function forceDelete(int $id): bool
    {
        $record = $this->find($id, ['*'], [], 'with');
        if ($record) {
            return $record->forceDelete();
        }

        return false;
    }

    public function restore(int $id): bool
    {
        $record = $this->find($id, ['*'], [], 'with');
        if ($record) {
            return $record->restore();
        }

        return false;
    }

}