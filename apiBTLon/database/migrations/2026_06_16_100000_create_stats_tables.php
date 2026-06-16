<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Bảng thống kê doanh thu theo ngày (~365 rows/năm)
        Schema::create('daily_revenue_stats', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->unsignedInteger('total_orders')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->unsignedInteger('total_cancelled')->default(0);
            $table->timestamps();
        });

        // Bảng thống kê bán hàng theo sản phẩm (1 row/product)
        Schema::create('product_sales_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('total_sold')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sales_stats');
        Schema::dropIfExists('daily_revenue_stats');
    }
};
