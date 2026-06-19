<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Base\EloquentRepository;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductRepository extends EloquentRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Summary of findBySlug
     * @param string $slug
     * @return Product|null
     */
    public function findBySlug(string $slug, array $relations = []): ?Product
    {
        return $this->model->where('slug', $slug)->with($relations)->first();
    }

    /**
     * Summary of getPaginated
     * @param array $filters
     * @return LengthAwarePaginator<int, \Illuminate\Database\Eloquent\Model>
     */
    public function getPaginated(
        array $filters
    ): LengthAwarePaginator {
        $query = $this->model->query();

        // Search
        if (!empty($filters['filter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('slug', 'like', '%' . $filters['filter'] . '%');
            });
        }

        // Category 
        if (!empty($filters['category_id'])) {
            $query->whereHas(
                'categories',
                fn($q) => $q->where(
                    'categories.id',
                    $filters['category_id']
                )
            );
        }

        if (isset($filters['min_price'])) {
            $query->whereRaw(
                'COALESCE(sale_price, price) >= ?',
                [$filters['min_price']]
            );
        }

        if (isset($filters['max_price'])) {
            $query->whereRaw(
                'COALESCE(sale_price, price) <= ?',
                [$filters['max_price']]
            );
        }

        // Sort
        match ($filters['sort_by'] ?? 'latest') {
            'latest' => $query->latest(),

            'best_selling' => $query->orderByDesc('sold_count'),

            'price_asc' => $query->orderByRaw('COALESCE(sale_price, price) ASC'),

            'price_desc' => $query->orderByRaw('COALESCE(sale_price, price) DESC'),

            default => $query->latest(),
        };

        // Soft delete
        match ($filters['trashed'] ?? null) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        $query->with(['images']);

        return $query->paginate($filters['per_page'] ?? 12);
    }

    public function create(array $attributes): Product
    {
        return DB::transaction(function () use ($attributes) {

            $categoryIds = $attributes['category_ids'] ?? [];

            unset($attributes['category_ids']);

            $product = $this->model->create($attributes);

            if (!empty($categoryIds)) {
                $product->categories()->sync($categoryIds);
            }

            return $product->load('categories');
        });
    }

    public function update(
        int $id,
        array $attributes
    ): bool {

        return DB::transaction(function () use ($id, $attributes) {

            $product = $this->find($id);

            if (!$product) {
                return false;
            }

            $categoryIds = $attributes['category_ids'] ?? null;

            unset($attributes['category_ids']);

            $updated = $product->update($attributes);

            if ($categoryIds !== null) {
                $product->categories()->sync($categoryIds);
            }

            return $updated;
        });
    }
}