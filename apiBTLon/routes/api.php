<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/**
 * Public Routes (read-only)
 */
Route::middleware('throttle:public-api')->group(function () {
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);

    Route::get('categories/count/{slug}', [CategoryController::class, 'countProducts']);
    Route::post('orders/track', [OrderController::class, 'trackOrder']);
});

/**
 * Authenticated Routes
 */
Route::middleware(['auth:sanctum', 'throttle:admin-api'])->group(function () {

    /** Categories */
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show'])->middleware('permission:manage_categories');
    Route::prefix('categories')->middleware('permission:manage_categories')->group(function () {
        Route::patch('{id}/restore', [CategoryController::class, 'restore']);
        Route::delete('{id}/force-delete', [CategoryController::class, 'forceDelete']);
    });

    /** Products */
    Route::apiResource('products', ProductController::class)->except(['index', 'show'])->middleware('permission:manage_products');
    Route::prefix('products')->middleware('permission:manage_products')->group(function () {
        Route::patch('{id}/restore', [ProductController::class, 'restore']);
        Route::delete('{id}/force-delete', [ProductController::class, 'forceDelete']);
    });

    Route::prefix('product-images')->middleware('permission:manage_products')->group(function () {
        Route::post('uploads/{slug}', [ProductController::class, 'uploadImages']);
        Route::post('{imageId}/update/{slug}', [ProductController::class, 'updateImages']);
        Route::delete('{imageId}/delete/{id}', [ProductController::class, 'destroyImages']);
    });

    /** Orders */
    Route::prefix('orders')->middleware('permission:manage_orders')->group(function () {
        Route::get('export', [OrderController::class, 'export']);
        Route::get('count', [OrderController::class, 'count']);
        Route::patch('{id}/restore', [OrderController::class, 'restore']);
        Route::delete('{id}/force-delete', [OrderController::class, 'forceDelete']);
    });
    Route::apiResource('orders', OrderController::class)->middleware('permission:manage_orders');

    /** Dashboard */
    Route::get('dashboard', [DashboardController::class, 'index'])->middleware('permission:view_dashboard');

    /** Auth */
    Route::post('auth/logout', [AuthController::class, 'logout']);
});

/**
 * Semi-public Routes (no auth, but stricter limits)
 */
Route::middleware('throttle:checkout')->group(function () {
    Route::post('orders/checkout', [OrderController::class, 'checkout']);
});

Route::middleware('throttle:cancel-order')->group(function () {
    Route::post('orders/request-cancel', [OrderController::class, 'requestCancel']);
    Route::post('orders/confirm-cancel', [OrderController::class, 'confirmCancel']);
});

/**
 * Auth Login
 */
Route::middleware('throttle:login')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);
});

/**
 * Auth check-token
 */
Route::middleware('auth:sanctum')->get('/auth/check-token', [
    AuthController::class,
    'checkToken'
]);