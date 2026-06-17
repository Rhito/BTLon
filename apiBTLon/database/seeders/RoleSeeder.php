<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Tạo các Permissions mặc định
        $permissions = [
            'view_dashboard',
            'manage_products',
            'manage_categories',
            'manage_orders',
            'manage_users'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Tạo 3 Roles (Super Admin, Manager, Staff)
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $staffRole = Role::firstOrCreate(['name' => 'Staff']);

        // 3. Gán tất cả quyền cho Manager (trừ manage_users)
        $managerPermissions = [
            'view_dashboard',
            'manage_products',
            'manage_categories',
            'manage_orders'
        ];
        $managerRole->syncPermissions($managerPermissions);

        // 4. Gán quyền manage_orders cho Staff
        $staffRole->syncPermissions(['manage_orders']);

        // Lưu ý: Super Admin không cần gán quyền tĩnh vì ta sẽ dùng Gate::before để tự động cho phép mọi quyền

        // 5. Tạo các tài khoản mẫu và gán Role
        $users = [
            ['email' => 'admin@shopmini.test', 'name' => 'Super Admin Test', 'spatie_role' => $superAdminRole],
            ['email' => 'manager@shopmini.test', 'name' => 'Manager Test', 'spatie_role' => $managerRole],
            ['email' => 'staff@shopmini.test', 'name' => 'Staff Test', 'spatie_role' => $staffRole],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => 'password',
                ]
            );

            // Đảm bảo cập nhật mật khẩu về đúng 'password' nếu user đã tồn tại
            $user->password = 'password';
            $user->save();

            $user->syncRoles([$data['spatie_role']]);
        }
    }
}
