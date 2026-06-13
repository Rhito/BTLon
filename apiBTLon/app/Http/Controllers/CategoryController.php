<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\CategoryIndexRequest;
use App\Http\Requests\CategoryCreateRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Controllers\Base\BaseController;
use App\Repositories\Interfaces\CategoryRepositoryInterface;

class CategoryController extends BaseController
{
    protected CategoryRepositoryInterface $categoryRepository;
    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index(CategoryIndexRequest $request)
    {
        $filters = $request->validated();
        $categories = $this->categoryRepository->getPaginated($filters);

        return $this->successWithPagiantion(
            $categories,
            CategoryResource::class,
            'retrieve data success.'
        );
    }

    public function store(CategoryCreateRequest $request)
    {
        $category = $this->categoryRepository->create(
            $request->validated()
        );

        return $this->success(
            'Category created successfully.',
            new CategoryResource($category),
            201
        );
    }

    public function update(CategoryUpdateRequest $request, int $id)
    {
        $updated = $this->categoryRepository->update(
            $id,
            $request->validated()
        );

        if (!$updated) {
            return $this->error(
                'category not found.',
                [],
                404
            );
        }

        return $this->success(
            'category updated successfully.'
        );
    }

    public function destroy(int $id)
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return $this->error(
                'Category not found.',
                [],
                404
            );
        }

        Gate::authorize('delete', $category);
        $deleted = $this->categoryRepository->delete($id);

        if (!$deleted) {
            return $this->error(
                'Category delete error.',
                [],
                404
            );
        }

        return $this->success(
            'Category deleted successfully.'
        );
    }

    public function forceDelete(int $id)
    {
        Gate::authorize('forceDelete', Category::class);
        $deleted = $this->categoryRepository->forceDelete($id);

        if (!$deleted) {
            return $this->error(
                'Category not found.',
                [],
                404
            );
        }

        return $this->success(
            'Category destroyed successfully.'
        );
    }

    public function restore(int $id)
    {
        Gate::authorize('restore', Category::class);
        $deleted = $this->categoryRepository->restore($id);

        if (!$deleted) {
            return $this->error(
                'Category not found.',
                [],
                404
            );
        }

        return $this->success(
            'Category restored successfully.'
        );
    }

    public function show(string $slug)
    {
        $category = $this->categoryRepository->findBySlug($slug);
        if (!$category) {
            return $this->error('Category not found.', [], 404);
        }

        return $this->success(
            'Category retrieved successfully.',
            new CategoryResource($category)
        );
    }

    public function countProducts(string $slug)
    {
        $numProducts = $this->categoryRepository->countProducts($slug);

        if (is_null($numProducts)) {
            return $this->error('Category not found.', [], 404);
        }

        return $this->success(
            'Category retrieved number products successfully.',
            ['total_products' => $numProducts]
        );
    }


}
