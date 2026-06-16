<?php

namespace App\Observers;

use App\Enums\OrderStatus;
use App\Models\DailyRevenueStat;
use App\Models\Order;
use App\Models\OrderStatusStat;
use App\Models\ProductSalesStat;
use Illuminate\Support\Facades\Cache;

class OrderObserver
{
    public function created(Order $order): void
    {
        OrderStatusStat::firstOrCreate(['status' => $order->status])->increment('total');
        $this->clearDashboardCache();
    }

    public function updated(Order $order): void
    {
        // Chỉ xử lý khi status thực sự thay đổi
        if ($order->wasChanged('status')) {
            $oldStatus = $order->getOriginal('status');
            if ($oldStatus) {
                OrderStatusStat::firstOrCreate(['status' => $oldStatus])->decrement('total');
            }
            OrderStatusStat::firstOrCreate(['status' => $order->status])->increment('total');

            $this->handleStatusChange($order);
        }

        $this->clearDashboardCache();
    }

    public function deleted(Order $order): void
    {
        OrderStatusStat::firstOrCreate(['status' => $order->status])->decrement('total');
        $this->clearDashboardCache();
    }

    public function forceDeleted(Order $order): void
    {
        // Tránh trừ âm nếu deleted đã gọi trước đó (nếu dùng softDelete, tuỳ logic ứng dụng)
        if (!$order->trashed() || !$order->isForceDeleting()) {
             OrderStatusStat::firstOrCreate(['status' => $order->status])->decrement('total');
        }
        $this->clearDashboardCache();
    }

    public function restored(Order $order): void
    {
        OrderStatusStat::firstOrCreate(['status' => $order->status])->increment('total');
        $this->clearDashboardCache();
    }

    /**
     * Xử lý khi order chuyển trạng thái.
     *
     * - → DELIVERED: increment daily_revenue_stats + product_sales_stats
     * - → CANCELLED: increment total_cancelled trong daily_revenue_stats
     */
    private function handleStatusChange(Order $order): void
    {
        $newStatus = $order->status;
        $today = now()->toDateString();

        if ($newStatus === OrderStatus::DELIVERED) {
            $this->incrementRevenueStats($order, $today);
            $this->incrementProductSalesStats($order);
        }

        if ($newStatus === OrderStatus::CANCELLED) {
            DailyRevenueStat::updateOrCreate(
                ['date' => $today],
                []
            )->increment('total_cancelled');
        }
    }

    /**
     * Cộng dồn doanh thu vào bảng daily_revenue_stats cho ngày hôm nay.
     */
    private function incrementRevenueStats(Order $order, string $date): void
    {
        $stat = DailyRevenueStat::firstOrCreate(
            ['date' => $date],
            ['total_orders' => 0, 'total_revenue' => 0, 'total_cancelled' => 0]
        );

        $stat->increment('total_orders');
        $stat->increment('total_revenue', $order->total_amount);
    }

    /**
     * Cộng dồn số lượng bán + doanh thu vào product_sales_stats cho từng sản phẩm.
     */
    private function incrementProductSalesStats(Order $order): void
    {
        // Eager load orderItems nếu chưa load
        $order->loadMissing('orderItems');

        foreach ($order->orderItems as $item) {
            $stat = ProductSalesStat::firstOrCreate(
                ['product_id' => $item->product_id],
                ['total_sold' => 0, 'total_revenue' => 0]
            );

            $stat->increment('total_sold', $item->quantity);
            $stat->increment('total_revenue', $item->quantity * $item->price);
        }
    }

    private function clearDashboardCache(): void
    {
        Cache::forget('dashboard:revenue');
        Cache::forget('dashboard:status');
        Cache::forget('dashboard:status_counts');
        Cache::forget('dashboard:top');
        Cache::forget('dashboard:low_stock');
        Cache::forget('dashboard:chart');
    }
}
