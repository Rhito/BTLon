<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncProductSoldCount extends Command
{
    protected $signature = 'products:sync-sold-count';
    protected $description = 'Đồng bộ lại dữ liệu sold_count cho các sản phẩm cũ từ bảng order_items';

    public function handle()
    {
        $this->info('Bắt đầu đồng bộ...');

        // Tính tổng số lượng từ các đơn hàng chưa bị hủy (hoặc tất cả như cũ)
        DB::statement('
            UPDATE products 
            SET sold_count = (
                SELECT COALESCE(SUM(quantity), 0)
                FROM order_items
                JOIN orders ON orders.id = order_items.order_id
                WHERE order_items.product_id = products.id
                  AND orders.status != "cancelled"
            )
        ');

        $this->info('Đồng bộ hoàn tất!');
    }
}
