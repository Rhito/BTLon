<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;

class OrderObserver
{
    public function created(Order $order): void
    {
        $this->clearCache();
    }
    public function updated(Order $order): void
    {
        $this->clearCache();
    }
    public function deleted(Order $order): void
    {
        $this->clearCache();
    }
    public function forceDeleted(Order $order): void
    {
        $this->clearCache();
    }
    public function restored(Order $order): void
    {
        $this->clearCache();
    }

    private function clearCache(): void
    {
        Cache::forget('dashboard:summary');
    }
}
