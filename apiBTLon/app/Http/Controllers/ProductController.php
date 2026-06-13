<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductIndexRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Requests\UploadProductImagesRequest;
use App\Http\Resources\ProductImageResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Services\ProductImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProductController extends BaseController
{
    protected ProductRepositoryInterface $productRepository;
    public function __construct(ProductRepositoryInterface $productRepository, protected ProductImageService $productImageService)
    {
        $this->productRepository = $productRepository;
    }

    public function index(ProductIndexRequest $request)
    {
        $filters = $request->validated();
        $products = $this->productRepository->getPaginated($filters);

        return $this->successWithPagiantion(
            $products,
            ProductResource::class,
            'retrieve data successfully.'
        );
    }

    public function store(ProductCreateRequest $request)
    {
        $product = $this->productRepository->create(
            $request->validated()
        );

        return $this->success(
            'Product created successfully.',
            new ProductResource($product),
            201
        );
    }

    public function update(ProductUpdateRequest $request, int $id)
    {
        $updated = $this->productRepository->update(
            $id,
            $request->validated()
        );

        if (!$updated) {
            return $this->error(
                'Product not found.',
                [],
                404
            );
        }

        return $this->success(
            'Product updated successfully.'
        );
    }

    public function destroy(int $id)
    {

        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->error(
                'Product not found.',
                [],
                404
            );
        }

        Gate::authorize('delete', $product);
        $deleted = $this->productRepository->delete($id);

        if (!$deleted) {
            return $this->error(
                'Product not found.',
                [],
                404
            );
        }

        return $this->success(
            'Product deleted successfully.'
        );
    }

    public function forceDelete(int $id)
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->error(
                'Product not found.',
                [],
                404
            );
        }

        Gate::authorize('forceDelete', $product);
        $deleted = $this->productRepository->forceDelete($id);

        if (!$deleted) {
            return $this->error(
                'Product delete error.',
                [],
                500
            );
        }

        return $this->success(
            'Product destroyed successfully.'
        );
    }

    public function restore(int $id)
    {
        $product = $this->productRepository->find($id, ['*'], [], 'with');

        if (!$product) {
            return $this->error(
                'Product not found.',
                [$product],
                404
            );
        }
        Gate::authorize('restore', $product);
        $deleted = $this->productRepository->restore($id);

        if (!$deleted) {
            return $this->error(
                'Product restore error.',
                [],
                500
            );
        }

        return $this->success(
            'Product restored successfully.'
        );
    }

    public function show(string $slug)
    {
        $product = $this->productRepository->findBySlug($slug, ['images']);
        if (!$product) {
            return $this->error('Product not found.', [], 404);
        }

        return $this->success(
            'Product retrieved successfully.',
            new ProductResource($product)
        );
    }
    public function uploadImages(UploadProductImagesRequest $request, string $slug): JsonResponse
    {
        $product = $this->productRepository->findBySlug($slug);

        if (!$product) {
            return $this->error('Product not found.', [], 404);
        }

        $mainImageIndex = (int) $request->input('main_image_index', 0);

        $this->productImageService->createProductImages($product, $request->file('images'), $mainImageIndex);

        return $this->success(
            'Product images uploaded successfully.',
            new ProductResource($product->load('images'))
        );
    }

    public function updateImages(Request $request, int $imageId, string $slug): JsonResponse
    {
        $product = $this->productRepository->findBySlug($slug);
        $request->validate([
            'image' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'set_as_main' => ['sometimes', 'boolean'],
        ]);

        $this->productImageService->updateProductImage(
            product: $product,
            imageId: $imageId,
            newFile: $request->file('image'),
            setAsMain: $request->boolean('set_as_main'),
        );

        return response()->json([
            'message' => 'Image updated successfully.',
            'image' => new ProductImageResource($product->images()->findOrFail($imageId)),
        ]);
    }

    public function destroyImages(int $imageId, string $slug): JsonResponse
    {
        $product = $this->productRepository->findBySlug($slug);
        $this->productImageService->removeProductImage($product, $imageId);

        return response()->json([
            'message' => 'Image removed successfully.',
        ]);
    }


}
