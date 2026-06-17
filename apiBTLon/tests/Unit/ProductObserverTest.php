<?php

namespace Tests\Unit;

use App\Jobs\SendLowStockNotificationJob;
use App\Models\Product;
use App\Observers\ProductObserver;
use App\Services\ProductImageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ProductObserverTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Gọi trực tiếp ProductObserver::updated() thay vì qua model lifecycle,
     * vì ProductObserver implements ShouldQueue nên khi save() được gọi,
     * chính observer method bị đưa vào queue chứ không chạy ngay.
     * Queue::fake() sẽ chặn việc chạy, khiến SendLowStockNotificationJob không bao giờ được dispatch.
     */
    public function test_low_stock_notification_job_is_dispatched()
    {
        Queue::fake();

        // Tạo product với stock = 10 (trên ngưỡng 5)
        $product = Product::factory()->create(['stock' => 10]);

        // Simulate: stock giảm xuống 4 (dưới ngưỡng)
        // syncOriginal() đảm bảo getOriginal('stock') = 10
        $product->syncOriginal();
        $product->stock = 4;

        // Gọi trực tiếp observer method, bỏ qua ShouldQueue
        $observer = app(ProductObserver::class);
        $observer->updated($product);

        Queue::assertPushed(SendLowStockNotificationJob::class, function ($job) use ($product) {
            return $job->product->id === $product->id;
        });
    }

    public function test_low_stock_notification_is_not_dispatched_for_sufficient_stock()
    {
        Queue::fake();

        // Tạo product với stock = 10 (trên ngưỡng)
        $product = Product::factory()->create(['stock' => 10]);

        // Stock giảm xuống 8, vẫn trên ngưỡng 5
        $product->syncOriginal();
        $product->stock = 8;

        $observer = app(ProductObserver::class);
        $observer->updated($product);

        Queue::assertNotPushed(SendLowStockNotificationJob::class);
    }
}
