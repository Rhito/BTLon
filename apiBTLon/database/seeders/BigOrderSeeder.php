<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class BigOrderSeeder extends Seeder
{
    /** Total number of orders to generate */
    private const TOTAL_ORDERS = 2_000_000;

    /** Rows per insert batch */
    private const CHUNK_SIZE = 1000;

    public function run(): void
    {
        $productIds = Product::pluck('id')->toArray();

        if (empty($productIds)) {
            $this->command->error('No products found. Seed products first.');
            return;
        }

        $statuses = [
            OrderStatus::PENDING,
            OrderStatus::CONFIRMED,
            OrderStatus::SHIPPING,
            OrderStatus::DELIVERED,
            OrderStatus::CANCELLED,
        ];

        // Pre-fetch product price map to avoid DB hits in the loop
        $productPrices = Product::query()
            ->select('id', 'price', 'sale_price')
            ->get()
            ->keyBy('id')
            ->map(fn($p) => $p->sale_price ?? $p->price)
            ->toArray();

        Schema::disableForeignKeyConstraints();
        DB::disableQueryLog();

        $bar = $this->command->getOutput()->createProgressBar(self::TOTAL_ORDERS);
        $bar->start();

        $ordersBatch = [];
        $now = Carbon::now();

        for ($i = 0; $i < self::TOTAL_ORDERS; $i++) {

            $daysAgo = rand(0, 365);
            $createdAt = $now->copy()->subDays($daysAgo)->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            // Status distribution: mostly delivered for older orders
            if ($daysAgo < 3) {
                $status = $statuses[array_rand([0, 1, 2, 3])]; // pending/confirmed/shipping/delivered
            } elseif (rand(1, 100) <= 5) {
                $status = OrderStatus::CANCELLED;
            } else {
                $status = OrderStatus::DELIVERED;
            }

            $updatedAt = $createdAt->copy();
            if ($status === OrderStatus::DELIVERED) {
                $updatedAt->addDays(rand(1, 3));
                if ($updatedAt->isFuture())
                    $updatedAt = $now->copy();
            } elseif ($status === OrderStatus::CANCELLED) {
                $updatedAt->addHours(rand(2, 48));
            }

            // Compute total_amount from 1-3 random products
            $numItems = rand(1, 3);
            $itemKeys = (array) array_rand($productIds, $numItems);
            $itemKeys = is_array($itemKeys) ? $itemKeys : [$itemKeys];

            $totalAmount = 0;
            $orderItems = [];

            foreach ($itemKeys as $key) {
                $productId = $productIds[$key];
                $price = $productPrices[$productId] ?? 0;
                $qty = rand(1, 2);
                $totalAmount += $price * $qty;

                $orderItems[] = [
                    'product_id' => $productId,
                    'quantity' => $qty,
                    'price' => $price,
                ];
            }

            $ordersBatch[] = [
                'order_code' => 'DH-' . strtoupper(Str::random(10)),
                'customer_name' => 'Khach hang ' . rand(1, 100000),
                'customer_email' => 'khachhang' . rand(1, 100000) . '@gmail.com',
                'customer_phone' => '09' . rand(10000000, 99999999),
                'customer_address' => rand(1, 999) . ' Duong Le Loi, Quan ' . rand(1, 12) . ', TP. HCM',
                'note' => rand(0, 1) ? 'Giao hang gio hanh chinh' : null,
                'payment_method' => rand(0, 1) ? 'COD' : 'BANKING',
                'status' => $status->value,
                'total_amount' => $totalAmount,
                'cancel_reason' => $status === OrderStatus::CANCELLED ? 'Khach hang doi y' : null,
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
                '_items' => $orderItems, // temp field, stripped before insert
            ];

            if (count($ordersBatch) >= self::CHUNK_SIZE) {
                $this->flushBatch($ordersBatch);
                $bar->advance(self::CHUNK_SIZE);
                $ordersBatch = [];
            }
        }

        // Flush remaining
        if (!empty($ordersBatch)) {
            $this->flushBatch($ordersBatch);
            $bar->advance(count($ordersBatch));
        }

        $bar->finish();
        $this->command->newLine();

        Schema::enableForeignKeyConstraints();
        $this->command->info('Done seeding ' . self::TOTAL_ORDERS . ' orders.');
    }

    /**
     * Insert a batch of orders, then insert their order_items
     * using the actual auto-increment IDs returned by the DB.
     */
    private function flushBatch(array $ordersBatch): void
    {
        // Extract items, strip temp field before insert
        $itemsMap = [];
        foreach ($ordersBatch as $i => &$order) {
            $itemsMap[$i] = $order['_items'];
            unset($order['_items']);
        }

        DB::transaction(function () use ($ordersBatch, $itemsMap) {
            // Track ID range: works reliably for InnoDB AUTO_INCREMENT
            // since this seeder runs single-threaded.
            $startId = (int) DB::table('orders')->max('id') + 1;

            DB::table('orders')->insert($ordersBatch);

            $itemsBatch = [];
            $currentId = $startId;

            foreach ($ordersBatch as $i => $order) {
                foreach ($itemsMap[$i] as $item) {
                    $itemsBatch[] = [
                        'order_id' => $currentId,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'created_at' => $order['created_at'],
                        'updated_at' => $order['updated_at'],
                    ];
                }
                $currentId++;
            }

            if (!empty($itemsBatch)) {
                // order_items batch can exceed CHUNK_SIZE (up to 3x) — split further
                foreach (array_chunk($itemsBatch, 1000) as $chunk) {
                    DB::table('order_items')->insert($chunk);
                }
            }
        });
    }
}