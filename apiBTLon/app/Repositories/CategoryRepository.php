<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Base\EloquentRepository;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryRepository extends EloquentRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Category
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function getPaginated(
        array $filters
    ): LengthAwarePaginator {
        $query = $this->model->query()->withCount('products');

        // Filter
        if (!empty($filters['filter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('slug', 'like', '%' . $filters['filter'] . '%');
            });
        }

        // Sort
        $query->orderBy(
            $filters['sort_by'] ?? 'id',
            $filters['sort_order'] ?? 'desc'
        );

        match ($filters['trashed'] ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        return $query->paginate($filters['per_page'] ?? 12);
    }

    public function countProducts(string $slug): ?int
    {
        $count = $this->model->where('slug', $slug)
            ->withCount('products')
            ->first();

        return $count ? $count->products_count : null;
    }
}