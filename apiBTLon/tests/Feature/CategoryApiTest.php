<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    protected $manager;
    protected $staff;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Setup Permissions
        $manageCategories = Permission::create(['name' => 'manage_categories']);
        $manageOrders = Permission::create(['name' => 'manage_orders']);

        // Setup Manager (has manage_categories)
        $managerRole = Role::create(['name' => 'Manager']);
        $managerRole->givePermissionTo($manageCategories);
        $this->manager = User::factory()->create();
        $this->manager->assignRole($managerRole);

        // Setup Staff (no manage_categories)
        $staffRole = Role::create(['name' => 'Staff']);
        $staffRole->givePermissionTo($manageOrders);
        $this->staff = User::factory()->create();
        $this->staff->assignRole($staffRole);
    }

    public function test_anyone_can_view_category_list()
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['items']]);
        
        $this->assertCount(3, $response->json('data.items'));
    }

    public function test_manager_can_create_category()
    {
        $response = $this->actingAs($this->manager)->postJson('/api/categories', [
            'name' => 'New Category',
            'description' => 'A test category',
            'is_active' => true,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'New Category');

        $this->assertDatabaseHas('categories', ['name' => 'New Category']);
    }

    public function test_staff_cannot_create_category()
    {
        $response = $this->actingAs($this->staff)->postJson('/api/categories', [
            'name' => 'Staff Category',
        ]);

        $response->assertStatus(403);
    }

    public function test_category_requires_name()
    {
        $response = $this->actingAs($this->manager)->postJson('/api/categories', [
            // Missing name
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('name');
    }

    public function test_manager_can_update_category()
    {
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->manager)->putJson("/api/categories/{$category->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('categories', ['name' => 'Updated Name']);
    }

    public function test_manager_can_delete_category()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->manager)->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }
}
