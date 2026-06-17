<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected $manager;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Setup Manager
        $manageProducts = Permission::create(['name' => 'manage_products']);
        $managerRole = Role::create(['name' => 'Manager']);
        $managerRole->givePermissionTo($manageProducts);
        
        $this->manager = User::factory()->create();
        $this->manager->assignRole($managerRole);
    }

    public function test_manager_can_create_product()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->manager)->postJson('/api/products', [
            'name' => 'New Product',
            'price' => 100000,
            'sale_price' => 80000,
            'stock' => 50,
            'is_active' => true,
            'category_ids' => [$category->id]
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'New Product')
                 ->assertJsonPath('data.price', 100000);

        $this->assertDatabaseHas('products', ['name' => 'New Product']);
    }

    public function test_product_validation_fails_when_sale_price_greater_than_price()
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->manager)->postJson('/api/products', [
            'name' => 'Invalid Product',
            'price' => 100000,
            'sale_price' => 120000, // Invalid: greater than price
            'stock' => 50,
            'category_ids' => [$category->id]
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('sale_price');
    }

    public function test_manager_can_update_product()
    {
        $product = Product::factory()->create(['name' => 'Old Name', 'price' => 50000]);
        $category = Category::factory()->create();

        $response = $this->actingAs($this->manager)->putJson("/api/products/{$product->slug}", [
            'name' => 'Updated Name',
            'price' => 60000,
            'stock' => 10,
            'category_ids' => [$category->id]
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('products', ['name' => 'Updated Name', 'price' => 60000]);
    }

    public function test_guest_cannot_modify_products()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->slug}");

        $response->assertStatus(401); // Unauthenticated
    }
}
