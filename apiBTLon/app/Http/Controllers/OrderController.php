<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Http\Requests\ComfirmCancelOrderRequest;
use App\Http\Requests\GuestCancelOrderRequest;
use App\Http\Requests\OrderExportRequest;
use App\Http\Requests\OrderIndexRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderItemResource;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    protected OrderRepositoryInterface $orderRepository;
    protected OrderService $orderService;
    public function __construct(OrderRepositoryInterface $orderRepository, OrderService $orderService)
    {
        $this->orderRepository = $orderRepository;
        $this->orderService = $orderService;
    }


    public function index(OrderIndexRequest $request)
    {
        $filters = $request->validated();
        $products = $this->orderRepository->getPaginated($filters);

        return $this->successWithPagiantion(
            $products,
            OrderResource::class,
            'retrieve data successfully.'
        );
    }

    public function update(UpdateOrderRequest $request, int $id)
    {
        try {
            $validatedData = $request->validated();

            $order = $this->orderService->updateStatus($id, $validatedData);

            return $this->success(
                'Order status updated successfully.',
                new OrderResource($order->load(['orderItems.product']))
            );

        } catch (\Exception $e) {
            return $this->error(
                'Failed to update order status.',
                [$e->getMessage()],
                422
            );
        }
    }

    public function destroy(int $id)
    {
        $deleted = $this->orderRepository->delete($id);

        if (!$deleted) {
            return $this->error(
                'Order not found.',
                [],
                404
            );
        }

        return $this->success(
            'Order deleted successfully.'
        );
    }

    public function forceDelete(int $id)
    {
        $deleted = $this->orderRepository->forceDelete($id);

        if (!$deleted) {
            return $this->error(
                'Order not found.',
                [],
                404
            );
        }

        return $this->success(
            'Order destroyed successfully.'
        );
    }

    public function show(mixed $id)
    {
        $order = $this->orderRepository->find($id);

        if (!$order) {
            return $this->error(
                'Order not found.',
                [],
                404
            );
        }

        return $this->success(
            'Order retrieve successfully.',
            new OrderResource($order->load(['orderItems.product.images']))
        );
    }

    public function restore(int $id)
    {
        $deleted = $this->orderRepository->restore($id);

        if (!$deleted) {
            return $this->error(
                'Order not found.',
                [],
                404
            );
        }

        return $this->success(
            'Order restored successfully.'
        );
    }
    public function checkout(StoreOrderRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $order = $this->orderService->checkout($validatedData);

            return $this->success(
                'Place an order successfully.',
                [
                    'order_code' => $order->order_code,
                    'total_amount' => $order->total_amount,
                    'customer_name' => $order->customer_name,
                    'items' => OrderItemResource::collection($order->orderItems),
                ],
                201
            );
        } catch (\Exception $e) {
            return $this->error(
                'Failed when place an order.',
                [$e->getMessage()],
                422
            );
        }
    }

    public function requestCancel(GuestCancelOrderRequest $request): JsonResponse
    {
        try {
            $this->orderService->requestGuestCancel($request->validated());
            return $this->success('A confirmation link has been sent to your email. Please check your inbox to complete the process.');
        } catch (\Exception $e) {
            return $this->error('Request failed.', [$e->getMessage()], 422);
        }
    }

    public function trackOrder(Request $request)
    {
        $request->validate([
            'order_code' => ['required', 'string', 'exists:orders,order_code'],
            'customer_email' => ['required', 'email'],
        ]);

        $order = $this->orderRepository->getOrderByCodeAndEmail($request->all());

        if (!$order) {
            return $this->error(
                'Order not found. Please check your order code and email.',
                [],
                404
            );
        }

        return $this->success(
            'Order retrieve successfully',
            new OrderResource($order->load(['orderItems.product']))
        );
    }


    public function confirmCancel(ComfirmCancelOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->confirmGuestCancel($request->validated());
            return $this->success(
                'Your order has been successfully canceled.',
                new OrderResource($order->load(['orderItems.product']))
            );
        } catch (\Exception $e) {
            return $this->error(
                'Orders cannot be canceled.',
                [$e->getMessage()],
                422
            );
        }
    }

    public function export(OrderExportRequest $request)
    {
        $filters = $request->validated();
        $filename = 'orders_' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($filters) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM để Excel đọc đúng tiếng Việt
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header row
            fputcsv($handle, [
                'Order Code',
                'Customer Name',
                'Customer Email',
                'Customer Phone',
                'Customer Address',
                'Payment Method',
                'Status',
                'Total Amount',
                'Cancel Reason',
                'Note',
                'Created At',
            ]);

            // Stream từng chunk, tránh load toàn bộ vào memory
            $this->orderRepository
                ->getForExport($filters)
                ->chunk(500, function ($orders) use ($handle) {
                    foreach ($orders as $order) {
                        fputcsv($handle, [
                            $order->order_code,
                            $order->customer_name,
                            $order->customer_email,
                            $order->customer_phone,
                            $order->customer_address,
                            $order->payment_method,
                            $order->status->value,
                            number_format($order->total_amount, 0, '.', ','),
                            $order->cancel_reason ?? '',
                            $order->note ?? '',
                            $order->created_at->format('d/m/Y H:i:s'),
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

}
