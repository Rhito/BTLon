<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\DailyRevenueStat;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSalesStat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Clear existing data to prevent duplication
        $start = microtime(true);
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Category::truncate();
        Product::truncate();
        DB::table('products_categories')->truncate();
        ProductImage::truncate();
        Order::truncate();
        DB::table('order_items')->truncate();
        DailyRevenueStat::truncate();
        ProductSalesStat::truncate();
        Schema::enableForeignKeyConstraints();

        dump(microtime(true) - $start);
        // 2. Admin User
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@shopmini.test',
            'role' => 'admin',
            'password' => bcrypt('password') // Using bcrypt explicitly
        ]);

        // 3. Categories
        $categoriesData = [
            ['name' => 'Điện thoại & Tablet', 'description' => 'Các sản phẩm điện thoại di động và máy tính bảng mới nhất.'],
            ['name' => 'Laptop & PC', 'description' => 'Máy tính xách tay và máy tính để bàn cấu hình cao.'],
            ['name' => 'Phụ kiện công nghệ', 'description' => 'Tai nghe, sạc dự phòng, cáp sạc, ốp lưng.'],
            ['name' => 'Nhà thông minh', 'description' => 'Thiết bị smarthome, camera, robot hút bụi.'],
            ['name' => 'Thiết bị âm thanh', 'description' => 'Loa bluetooth, tai nghe không dây, soundbar.'],
        ];

        $categories = collect();
        foreach ($categoriesData as $cat) {
            $categories->push(Category::create([
                'name' => $cat['name'],
                'description' => $cat['description'],
                'is_active' => true,
            ]));
        }

        // 4. Products
        $productsData = [
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'description' => 'iPhone 15 Pro Max. Được rèn từ titan. Trang bị chip A17 Pro mang tính bước ngoặt. Nút Tác Vụ tùy chỉnh. Cùng hệ thống camera iPhone mạnh mẽ nhất từ trước đến nay.',
                'price' => 34990000,
                'sale_price' => 29590000,
                'stock' => 50,
                'cats' => [0], // Index of category
                'img' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Chào mừng đến với kỷ nguyên AI trên điện thoại di động. Nâng tầm trải nghiệm nhiếp ảnh, giải trí và làm việc với Galaxy S24 Ultra.',
                'price' => 33990000,
                'sale_price' => 29990000,
                'stock' => 45,
                'cats' => [0],
                'img' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'MacBook Pro 14 inch M3 Pro',
                'description' => 'MacBook Pro 14 inch siêu mạnh mẽ với chip M3 Pro. Màn hình Liquid Retina XDR tuyệt đẹp và thời lượng pin lên đến 18 giờ.',
                'price' => 49990000,
                'sale_price' => null,
                'stock' => 20,
                'cats' => [1],
                'img' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'Tai nghe Sony WH-1000XM5',
                'description' => 'Tai nghe chống ồn tốt nhất của Sony. Âm thanh độ phân giải cao, thiết kế siêu nhẹ.',
                'price' => 7990000,
                'sale_price' => 6490000,
                'stock' => 100,
                'cats' => [2, 4],
                'img' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'Robot hút bụi Roborock S8 Pro Ultra',
                'description' => 'Robot hút bụi thông minh với trạm sạc tự động giặt giẻ, làm trống hộp bụi và sấy khô.',
                'price' => 24990000,
                'sale_price' => 21990000,
                'stock' => 15,
                'cats' => [3],
                'img' => 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'Bàn phím cơ Keychron Q1 Pro',
                'description' => 'Bàn phím cơ custom không dây với thân nhôm nguyên khối nguyên khối, hỗ trợ QMK/VIA.',
                'price' => 4590000,
                'sale_price' => null,
                'stock' => 30,
                'cats' => [2],
                'img' => 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop'
            ],
            [
                'name' => 'Loa Marshall Stanmore III',
                'description' => 'Loa bluetooth với thiết kế cổ điển mang tính biểu tượng của Marshall, âm thanh mạnh mẽ.',
                'price' => 10990000,
                'sale_price' => 9990000,
                'stock' => 25,
                'cats' => [4],
                'img' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop'
            ],
        ];

        $products = collect();
        foreach ($productsData as $data) {
            $product = Product::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'price' => $data['price'],
                'sale_price' => $data['sale_price'],
                'stock' => $data['stock'],
                'is_active' => true,
            ]);

            // Sync categories
            $catIds = array_map(fn($idx) => $categories[$idx]->id, $data['cats']);
            $product->categories()->sync($catIds);

            // Add an image (mock URL)
            ProductImage::create([
                'product_id' => $product->id,
                'img_url' => $data['img'],
                'thumbnail_url' => $data['img'],
                'is_main' => true,
            ]);

            $products->push($product);
        }

        // 5. Orders (Fake realistic history over last 30 days)
        $statuses = [
            OrderStatus::PENDING,
            OrderStatus::CONFIRMED,
            OrderStatus::SHIPPING,
            OrderStatus::DELIVERED,
            OrderStatus::CANCELLED
        ];

        // Tạo 40 đơn hàng rải rác trong 30 ngày qua
        for ($i = 0; $i < 40; $i++) {
            // Random date in past 30 days
            $daysAgo = rand(0, 30);
            $createdAt = Carbon::now()->subDays($daysAgo)->subHours(rand(1, 23));

            // Random status. Hầu hết là DELIVERED cho các đơn cũ
            $status = OrderStatus::DELIVERED;
            if ($daysAgo < 3) {
                // Đơn mới thì có thể pending/shipping
                $status = $statuses[rand(0, 3)];
            } else if (rand(1, 10) > 8) {
                $status = OrderStatus::CANCELLED;
            }

            // Nếu giao thành công, update_at sẽ thường là 1-3 ngày sau ngày đặt
            $updatedAt = clone $createdAt;
            if ($status === OrderStatus::DELIVERED) {
                $updatedAt->addDays(rand(1, 3));
                if ($updatedAt->isFuture()) {
                    $updatedAt = Carbon::now();
                }
            } else if ($status === OrderStatus::CANCELLED) {
                $updatedAt->addHours(rand(2, 48));
            }

            $orderCode = 'DH-' . strtoupper(substr(str_replace('-', '', Str::uuid()), 0, 10));

            $order = Order::create([
                'order_code' => $orderCode,
                'customer_name' => "Khách hàng " . rand(1, 100),
                'customer_email' => "khachhang" . rand(1, 100) . "@gmail.com",
                'customer_phone' => '09' . rand(10000000, 99999999),
                'customer_address' => rand(1, 200) . " Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM",
                'note' => rand(0, 1) ? 'Giao hàng giờ hành chính' : null,
                'payment_method' => rand(0, 1) ? 'COD' : 'BANKING',
                'status' => $status,
                'total_amount' => 0, // Sẽ tính bên dưới
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
                'cancel_reason' => $status === OrderStatus::CANCELLED ? 'Khách hàng đổi ý' : null,
            ]);

            // Add 1-3 random items
            $numItems = rand(1, 3);
            $totalAmount = 0;

            $shuffledProducts = $products->shuffle()->take($numItems);

            foreach ($shuffledProducts as $product) {
                $qty = rand(1, 2);
                $price = $product->sale_price ?? $product->price;
                $totalAmount += ($price * $qty);

                DB::table('order_items')->insert([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price' => $price,
                    'created_at' => $createdAt,
                    'updated_at' => $updatedAt,
                ]);
            }

            // Update total
            $order->update(['total_amount' => $totalAmount]);

            // Reset timestamps again because update() changes updated_at to now
            $order->timestamps = false;
            $order->created_at = $createdAt;
            $order->updated_at = $updatedAt;
            $order->save();
        }

        // 6. Rebuild stats tables từ dữ liệu vừa seed
        $this->command->info('Rebuilding stats tables...');
        \Illuminate\Support\Facades\Artisan::call('stats:rebuild');
        $this->command->info('Done!');
    }
}
