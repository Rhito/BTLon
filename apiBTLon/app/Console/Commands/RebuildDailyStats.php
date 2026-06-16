<?php

namespace App\Console\Commands;

use App\Enums\OrderStatus;
use App\Models\DailyRevenueStat;
use App\Models\ProductSalesStat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RebuildDailyStats extends Command
{
    protected $signature = 'stats:rebuild {--chunk=5000 : Số records xử lý mỗi batch}';

    protected $description = 'Rebuild toàn bộ daily_revenue_stats và product_sales_stats từ bảng orders. Dùng khi deploy lần đầu, repair data, hoặc scheduled job.';

    public function handle(): int
    {
        $this->info('🔄 Bắt đầu rebuild stats...');
        $startTime = microtime(true);

        $this->rebuildDailyRevenueStats();
        $this->rebuildProductSalesStats();
        $this->rebuildOrderStatusStats();

        $elapsed = round(microtime(true) - $startTime, 2);
        $this->newLine();
        $this->info("✅ Rebuild hoàn tất trong {$elapsed}s");

        return self::SUCCESS;
    }

    private function rebuildDailyRevenueStats(): void
    {
        $this->info('');
        $this->info('📊 Rebuilding daily_revenue_stats...');

        // Truncate + rebuild bằng 1 INSERT ... SELECT (nhanh nhất cho bulk data)
        DailyRevenueStat::truncate();

        // Revenue stats: chỉ đếm đơn DELIVERED, group by ngày updated_at
        $deliveredCount = DB::table('orders')
            ->where('status', OrderStatus::DELIVERED->value)
            ->whereNull('deleted_at')
            ->count();

        $this->info("  → Tìm thấy {$deliveredCount} đơn DELIVERED");

        if ($deliveredCount > 0) {
            DB::statement("
                INSERT INTO daily_revenue_stats (date, total_orders, total_revenue, total_cancelled, created_at, updated_at)
                SELECT
                    DATE(updated_at) as date,
                    COUNT(*) as total_orders,
                    COALESCE(SUM(total_amount), 0) as total_revenue,
                    0 as total_cancelled,
                    NOW() as created_at,
                    NOW() as updated_at
                FROM orders
                WHERE status = ?
                AND deleted_at IS NULL
                GROUP BY DATE(updated_at)
            ", [OrderStatus::DELIVERED->value]);
        }

        // Cancelled stats: cộng thêm vào các ngày đã có hoặc tạo mới
        $cancelledCount = DB::table('orders')
            ->where('status', OrderStatus::CANCELLED->value)
            ->whereNull('deleted_at')
            ->count();

        $this->info("  → Tìm thấy {$cancelledCount} đơn CANCELLED");

        if ($cancelledCount > 0) {
            // Lấy cancelled count group by date
            $cancelledByDate = DB::table('orders')
                ->where('status', OrderStatus::CANCELLED->value)
                ->whereNull('deleted_at')
                ->selectRaw('DATE(updated_at) as date, COUNT(*) as total')
                ->groupBy(DB::raw('DATE(updated_at)'))
                ->get();

            foreach ($cancelledByDate as $row) {
                DailyRevenueStat::updateOrCreate(
                    ['date' => $row->date],
                    ['total_orders' => 0, 'total_revenue' => 0]
                )->increment('total_cancelled', $row->total);
            }
        }

        $totalStats = DailyRevenueStat::count();
        $this->info("  ✅ Tạo {$totalStats} records trong daily_revenue_stats");
    }

    private function rebuildProductSalesStats(): void
    {
        $this->info('');
        $this->info('🏆 Rebuilding product_sales_stats...');

        ProductSalesStat::truncate();

        // INSERT ... SELECT: chỉ tính từ đơn DELIVERED
        $count = DB::statement("
            INSERT INTO product_sales_stats (product_id, total_sold, total_revenue, created_at, updated_at)
            SELECT
                oi.product_id,
                SUM(oi.quantity) as total_sold,
                SUM(oi.quantity * oi.price) as total_revenue,
                NOW() as created_at,
                NOW() as updated_at
            FROM order_items oi
            INNER JOIN orders o ON oi.order_id = o.id
            WHERE o.status = ?
            AND o.deleted_at IS NULL
            GROUP BY oi.product_id
        ", [OrderStatus::DELIVERED->value]);

        $totalStats = ProductSalesStat::count();
        $this->info("  ✅ Tạo {$totalStats} records trong product_sales_stats");
    }

    private function rebuildOrderStatusStats(): void
    {
        $this->info('');
        $this->info('📈 Rebuilding order_status_stats...');

        \App\Models\OrderStatusStat::truncate();

        DB::statement("
            INSERT INTO order_status_stats (status, total, created_at, updated_at)
            SELECT
                status,
                COUNT(*) as total,
                NOW() as created_at,
                NOW() as updated_at
            FROM orders
            WHERE deleted_at IS NULL
            GROUP BY status
        ");

        $totalStats = \App\Models\OrderStatusStat::count();
        $this->info("  ✅ Tạo {$totalStats} records trong order_status_stats");
    }
}
