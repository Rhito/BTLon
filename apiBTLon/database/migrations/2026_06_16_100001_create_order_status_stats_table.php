<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Bảng thống kê trạng thái đơn hàng (mỗi trạng thái 1 dòng)
        Schema::create('order_status_stats', function (Blueprint $table) {
            $table->string('status', 50)->primary(); // Dùng status làm khoá chính
            $table->unsignedInteger('total')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_stats');
    }
};
