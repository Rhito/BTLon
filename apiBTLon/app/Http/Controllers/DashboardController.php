<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends BaseController
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {
    }

    public function index(): JsonResponse
    {
        return $this->success(
            'Dashboard data retrieved successfully.',
            $this->dashboardService->getSummary()
        );
    }
}
