<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_admin_can_login_with_correct_credentials()
    {
        // 1. Arrange
        $role = Role::create(['name' => 'Super Admin']);
        $user = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);
        $user->assignRole($role);

        // 2. Act
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        // 3. Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => [
                             'id', 'name', 'email', 'roles', 'permissions'
                         ],
                         'token'
                     ]
                 ]);
    }

    public function test_admin_cannot_login_with_incorrect_password()
    {
        $role = Role::create(['name' => 'Super Admin']);
        $user = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);
        $user->assignRole($role);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'credentials do not match.']);
    }

    public function test_users_without_roles_cannot_login()
    {
        // User created but no roles assigned
        $user = User::factory()->create([
            'email' => 'norole@test.com',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'norole@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Your account has no assigned roles. Please contact super admin.']);
    }

    public function test_user_can_logout()
    {
        $role = Role::create(['name' => 'Super Admin']);
        $user = User::factory()->create([
            'password' => 'password',
        ]);
        $user->assignRole($role);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'logout successfully.']);
                 
        $this->assertCount(0, $user->tokens); // Ensure token is deleted
    }
}
