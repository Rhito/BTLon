<?php

namespace App\Observers;

use App\Jobs\SendLowStockNotificationJob;
use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockNotification;
use App\Services\ProductImageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProductObserver implements ShouldQueue
{
    use Queueable;
    public function __construct(
        protected ProductImageService $imageService
    ) {
    }

    public function updated(Product $product): void
    {
        $threshold = config('inventory.low_stock_threshold', 5);

        if (
            $product->isDirty('stock') &&
            $product->getOriginal('stock') >= $threshold &&
            $product->stock < $threshold
        ) {
            dispatch(new SendLowStockNotificationJob($product));
        }
    }

    public function forceDeleting(Product $product): void
    {
        $this->imageService->deleteMany($product->images);
    }

}
