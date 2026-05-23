<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfilePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            BuildingSeeder::class,
            DepartmentSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);
    }

    public function test_authenticated_user_can_view_profile_page(): void
    {
        $user = User::query()->where('username', 'enduser')->first();

        $this->actingAs($user)
            ->get(route('profile.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('profile/index')
                ->has('profile')
                ->has('role_meta')
                ->where('profile.username', $user->username));
    }

    public function test_user_can_update_profile_from_profile_page(): void
    {
        $user = User::query()->where('username', 'enduser')->first();

        $this->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Updated End User',
                'username' => 'enduser',
            ])
            ->assertRedirect(route('profile.index'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated End User',
        ]);
    }

    public function test_settings_profile_redirects_to_profile_page(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->get(route('profile.edit'))
            ->assertRedirect(route('profile.index'));
    }
}
