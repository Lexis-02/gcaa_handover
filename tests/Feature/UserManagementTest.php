<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            DepartmentSeeder::class,
            RolesAndPermissionsSeeder::class,
        ]);
    }

    public function test_super_admin_can_view_users_index(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->get(route('users.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('users/index'));
    }

    public function test_ict_admin_cannot_access_users(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_super_admin_can_create_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $this->actingAs($admin)
            ->post(route('users.store'), [
                'name' => 'Test Stores',
                'username' => 'teststores',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'stores_officer',
                'is_active' => true,
            ])
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'username' => 'teststores',
        ]);
    }
}
