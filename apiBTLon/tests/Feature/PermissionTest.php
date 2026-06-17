<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_super_admin_bypasses_gates_and_can_access_anything()
    {
        // 1. Tạo Super Admin role (không cần gán Permission tĩnh nào cho nó)
        $superAdminRole = Role::create(['name' => 'Super Admin']);
        $user = User::factory()->create();
        $user->assignRole($superAdminRole);

        // 2. Tạo một permission hệ thống cần
        Permission::create(['name' => 'manage_categories']);

        // 3. Act & Assert: Dù không có permission 'manage_categories' trực tiếp, 
        // Super Admin vẫn được Gate::before cho qua.
        $this->assertTrue($user->can('manage_categories'));

        // Thử gọi API tạo danh mục
        $response = $this->actingAs($user)->postJson('/api/categories', [
            'name' => 'Test Category',
            'is_active' => true,
        ]);

        $response->assertStatus(201); // Created successfully
    }

    public function test_user_without_permission_is_forbidden()
    {
        // 1. Tạo role Staff và cấp quyền manage_orders
        $staffRole = Role::create(['name' => 'Staff']);
        $manageOrders = Permission::create(['name' => 'manage_orders']);
        $staffRole->givePermissionTo($manageOrders);
        
        $user = User::factory()->create();
        $user->assignRole($staffRole);

        // Permission cần thiết cho categories
        Permission::create(['name' => 'manage_categories']);

        // 2. Act: Cố tình gọi API quản lý danh mục (yêu cầu manage_categories)
        $response = $this->actingAs($user)->postJson('/api/categories', [
            'name' => 'Test Category',
        ]);

        // 3. Assert
        $response->assertStatus(403); // Bị chặn hoàn toàn
    }
}
