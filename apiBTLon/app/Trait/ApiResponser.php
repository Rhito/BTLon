<?php

namespace App\Trait;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

trait ApiResponser
{
    /**
     * 
     * @param string $message
     * @param mixed $data
     * @param mixed $code
     * @return JsonResponse
     */
    protected function success(string $message = 'Success', $data = [], $code = 200): JsonResponse
    {
        return response()->json([
            "success" => true,
            'message' => $message,
            "data" => $data
        ], $code);
    }

    /**
     * 
     * @param string $message
     * @param mixed $errors
     * @param mixed $code
     * @return JsonResponse
     */
    public function error(string $message = 'An error occurred', $errors = [], $code = 500): JsonResponse
    {
        return response()->json([
            "success" => false,
            'message' => $message,
            'errors' => $errors
        ], $code);
    }

    /**
     * successWithPagiantion
     * @param mixed $message
     * @param mixed $paginator
     * @param mixed $resourceClass
     * @param mixed $status
     * @return JsonResponse
     */
    /**
     * successWithPagination (Đã sửa lại lỗi type: Pagiantion -> Pagination)
     * * @param mixed $paginator
     * @param mixed $resourceClass
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    protected function successWithPagination($paginator, $resourceClass, $message = 'Success paginate', $status = 200): JsonResponse
    {
        // Data chung cơ bản nhất
        $paginationMeta = [
            'per_page' => $paginator->perPage(),
            'has_more' => $paginator->hasMorePages(),
        ];

        // 1. Xử lý cho LengthAwarePaginator (Phân trang mặc định)
        if ($paginator instanceof LengthAwarePaginator) {
            $paginationMeta = array_merge($paginationMeta, [
                'type' => 'length_aware',
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'first_item' => $paginator->firstItem(),
                'last_item' => $paginator->lastItem(),
            ]);
        }

        // 2. Xử lý cho CursorPaginator (Phân trang tốc độ cao)
        elseif ($paginator instanceof CursorPaginator) {
            $paginationMeta = array_merge($paginationMeta, [
                'type' => 'cursor',
                'next_cursor' => $paginator->nextCursor() ? $paginator->nextCursor()->encode() : null,
                'prev_cursor' => $paginator->previousCursor() ? $paginator->previousCursor()->encode() : null,
            ]);
        }

        // 3. Xử lý cho Paginator (SimplePaginate)
        elseif ($paginator instanceof Paginator) {
            $paginationMeta = array_merge($paginationMeta, [
                'type' => 'simple',
                'current_page' => $paginator->currentPage(),
                'first_item' => $paginator->firstItem(),
                'last_item' => $paginator->lastItem(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'items' => $resourceClass::collection($paginator),
                'pagination' => $paginationMeta
            ]
        ], $status);
    }
}
