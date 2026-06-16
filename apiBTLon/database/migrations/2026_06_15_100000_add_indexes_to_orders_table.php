<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Tối ưu bảng orders cho 2M+ records.
     *
     * - Composite index (status, created_at) → filter by status + sort/range
     * - Index trên created_at → range filter + sort
     * - Index trên customer_email, customer_phone → search chính xác nhanh
     * - Index trên cancel_token → lookup cancel token
     * - Fulltext index → tìm kiếm text nhanh thay cho LIKE '%keyword%'
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Composite index: filter status + sort/range by date (phổ biến nhất)
            $table->index(['status', 'created_at'], 'idx_orders_status_created');
            $table->index(['status', 'updated_at'], 'idx_orders_status_updated');

            // Single column indexes cho filter riêng lẻ
            $table->index('created_at', 'idx_orders_created_at');
            $table->index('customer_email', 'idx_orders_customer_email');
            $table->index('customer_phone', 'idx_orders_customer_phone');
            $table->index('cancel_token', 'idx_orders_cancel_token');

            // Fulltext index cho tìm kiếm text (thay thế LIKE '%keyword%')
            $table->fullText(
                ['order_code', 'customer_name', 'customer_email', 'customer_phone'],
                'ft_orders_search'
            );
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_status_created');
            $table->dropIndex('idx_orders_status_updated');
            $table->dropIndex('idx_orders_created_at');
            $table->dropIndex('idx_orders_customer_email');
            $table->dropIndex('idx_orders_customer_phone');
            $table->dropIndex('idx_orders_cancel_token');
            $table->dropFullText('ft_orders_search');
        });
    }
};
