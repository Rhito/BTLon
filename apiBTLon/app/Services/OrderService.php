<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\Product;
use App\Enums\OrderStatus;
use Illuminate\Support\Str;
use App\Mail\ConfirmOrderCheckout;
use App\Mail\GuestCancelOrderMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class OrderService
{
    protected OrderRepositoryInterface $orderRepository;
    public function __construct(OrderRepositoryInterface $orderRepository, protected ProductRepository $productRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function checkout(array $requestData)
    {
        return DB::transaction(function () use ($requestData) {
            $totalAmount = 0;
            $itemsForRepo = [];

            foreach ($requestData['cart'] as $cartItem) {
                $product = Product::lockForUpdate()->findOrFail($cartItem['product_id']);

                if ($product->stock < $cartItem['quantity'])
                    throw new \Exception("The product {$product->name} is currently out of stock or does not have enough quantity available($product->stock).");

                $product->decrement('stock', $cartItem['quantity']);
                $product->increment('sold_count', $cartItem['quantity']);

                $itemPrice = $product->sale_price ?? $product->price;
                $totalAmount += $itemPrice * $cartItem['quantity'];

                $itemsForRepo[] = [
                    'product_id' => $product->id,
                    'quantity' => $cartItem['quantity'],
                    'price' => $itemPrice
                ];
            }
            $orderPayload = [
                'order_code' => 'DH-' . strtoupper(substr(str_replace('-', '', Str::uuid()), 0, 10)),
                'customer_name' => $requestData['customer_name'],
                'customer_email' => $requestData['customer_email'],
                'customer_phone' => $requestData['customer_phone'],
                'customer_address' => $requestData['customer_address'],
                'note' => $requestData['note'] ?? null,
                'payment_method' => $requestData['payment_method'],
                'total_amount' => $totalAmount,
                'status' => OrderStatus::PENDING,
                'items' => $itemsForRepo
            ];
            $order = $this->orderRepository->placeAnOrder($orderPayload);
            Mail::to($order->customer_email)->send(new ConfirmOrderCheckout($order));

            return $order;
        });
    }

    public function updateStatus(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $order = $this->orderRepository->find($id);

            if (!$order) {
                throw new \Exception('Order not found.');
            }

            $newStatus = OrderStatus::from($data['status']);

            // Validate luồng chuyển trạng thái
            if (!$order->status->canTransitionTo($newStatus)) {
                $allowed = array_map(
                    fn($s) => $s->label(),
                    $order->status->allowedTransitions()
                );
                $allowedStr = !empty($allowed) ? implode(', ', $allowed) : 'not available';

                throw new \Exception(
                    "Cannot transition from '{$order->status->label()}' to '{$newStatus->label()}'. "
                    . "Allowed status: {$allowedStr}."
                );
            }

            $order->update([
                'status' => $newStatus,
                'cancel_reason' => $newStatus === OrderStatus::CANCELLED
                    ? ($data['cancel_reason'] ?? null)
                    : null,
            ]);

            // Hoàn lại stock khi hủy đơn
            if ($newStatus === OrderStatus::CANCELLED) {
                $order->load('orderItems.product'); // Eager load (1 query)

                // Batch update bằng single query
                $updates = $order->orderItems
                    ->filter(fn($item) => $item->product)
                    ->groupBy('product_id')
                    ->map(fn($items) => $items->sum('quantity'));

                foreach ($updates as $productId => $qty) {
                    $product = $this->productRepository->find($productId);
                    if ($product) {
                        $product->increment('stock', $qty);
                        $product->decrement('sold_count', $qty);
                    }
                }
            }


            return $order;
        });
    }

    public function requestGuestCancel(array $data): void
    {
        $order = $this->orderRepository->getOrderByCodeAndEmail($data);
        if (!$order) {
            throw new \Exception("Can not cancel the order.");
        }

        if ($order->status !== OrderStatus::PENDING)
            throw new \Exception('Only cancel the order when it on pending status.');

        $token = Str::random(40);
        $order->update([
            'cancel_token' => hash('sha256', $token),
            'cancel_token_expires_at' => Carbon::now()->addMinutes(15),
            'cancel_reason' => $data['cancel_reason'] ?? 'The customer (Guest) proactively requested to cancel the order through the system.',
        ]);

        $confirmUrl = config('app.frontend_url', 'http://localhost:3000') . '/confirm-cancel-order?token=' . $token;

        Mail::to($order->customer_email)->send(new GuestCancelOrderMail($order, $confirmUrl, $token));
    }


    public function confirmGuestCancel(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = $this->orderRepository->getValidCancelOrder(hash('sha256', $data['cancel_token']));
            if (!$order) {
                throw new NotFoundHttpException("TOKEN_EXPIRED_OR_INVALID|The verification token is invalid or has expired.");
            }

            if ($order->status !== OrderStatus::PENDING) {
                throw new BadRequestHttpException("INVALID_ORDER_STATUS|Only orders with a pending status can be canceled. Current status: {$order->status->value}");
            }

            $order->update([
                'status' => OrderStatus::CANCELLED,
                'cancel_token' => null,
                'cancel_token_expires_at' => null
            ]);

            $order->load('orderItems.product');

            $updates = $order->orderItems
                ->filter(fn($item) => $item->product)
                ->groupBy('product_id')
                ->map(fn($items) => $items->sum('quantity'));

            foreach ($updates as $productId => $qty) {
                $prod = Product::where('id', $productId)->first();
                if ($prod) {
                    $prod->increment('stock', $qty);
                    $prod->decrement('sold_count', $qty);
                }
            }

            return $order;
        });
    }

}