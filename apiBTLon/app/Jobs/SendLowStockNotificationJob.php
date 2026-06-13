<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class SendLowStockNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly Product $product
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $admins = User::admins()->get();

        if ($admins->isEmpty()) {
            return;
        }

        Notification::send($admins, new LowStockNotification($this->product));
    }
    public function failed(\Throwable $exception): void
    {
        \Log::error('SendLowStockNotificationJob failed', [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'error' => $exception->getMessage(),
        ]);
    }
}
