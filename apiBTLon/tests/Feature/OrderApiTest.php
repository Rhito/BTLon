<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Setup Admin
        $manageOrders = Permission::create(['name' => 'manage_orders']);
        $adminRole = Role::create(['name' => 'Manager']);
        $adminRole->givePermissionTo($manageOrders);
        
        $this->admin = User::factory()->create();
        $this->admin->assignRole($adminRole);
    }

    public function test_guest_can_create_order()
    {
        $product = Product::factory()->create(['price' => 100000, 'stock' => 10]);

        $response = $this->postJson('/api/orders/checkout', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '0123456789',
            'customer_address' => '123 Test St',
            'payment_method' => 'COD',
            'cart' => [
                ['product_id' => $product->id, 'quantity' => 2]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.customer_name', 'John Doe');

        // Verify stock was reduced
        $this->assertEquals(8, $product->fresh()->stock);
    }

    public function test_admin_can_update_order_status()
    {
        $order = Order::factory()->create(['status' => OrderStatus::PENDING->value]);

        $response = $this->actingAs($this->admin)->putJson("/api/orders/{$order->id}", [
            'status' => OrderStatus::CONFIRMED->value,
            'note' => 'Confirming order now'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', OrderStatus::CONFIRMED->value);
    }

    public function test_user_without_permission_cannot_view_orders()
    {
        // User with no roles
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/orders');

        $response->assertStatus(403);
    }

    public function test_guest_can_cancel_order_with_valid_token()
    {
        $rawToken = \Illuminate\Support\Str::random(40);
        $order = Order::factory()->create([
            'status' => OrderStatus::PENDING->value,
            'cancel_token' => hash('sha256', $rawToken)
        ]);

        // Attempt cancel using confirmCancel (since we have the token directly)
        $response = $this->postJson("/api/orders/confirm-cancel", [
            'order_code' => $order->order_code,
            'cancel_token' => $rawToken,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(OrderStatus::CANCELLED, $order->fresh()->status);
    }
}
