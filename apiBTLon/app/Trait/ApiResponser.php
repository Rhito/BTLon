<?php

namespace App\Trait;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

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
    protected function successWithPagiantion($paginator, $resourceClass, $message = 'Success paginate', $status = 200)
    {
        return response()->json(
            [
                'success' => true,
                'message' => $message,
                'data' => [
                    'items' => $resourceClass::collection($paginator),
                    'pagination' => [
                        'total' => $paginator->total(),
                        'per_page' => $paginator->perPage(),
                        'current_page' => $paginator->currentPage(),
                        'last_page' => $paginator->lastPage(),
                        'firstItem' => $paginator->firstItem(),
                        'lastItem' => $paginator->lastItem(),
                    ]
                ]
            ],
            $status
        );
    }
}
