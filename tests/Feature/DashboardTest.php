<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();
        $user->assignRole('end_user');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_dashboard_resolves_role_specific_page(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard/index')
            ->where('role', 'ict_admin')
            ->has('meta.title')
        );
    }

    public function test_super_admin_role_takes_priority_over_other_roles(): void
    {
        $user = User::factory()->create();
        $user->assignRole(['end_user', 'super_admin']);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page->where('role', 'super_admin'));
    }

    public function test_shared_navigation_includes_dashboard_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        $user->assignRole('stores_officer');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->has('navigation.main.0.title')
            ->where('navigation.main.0.title', 'Dashboard')
        );
    }

    public function test_super_admin_navigation_shows_only_lookups_and_users(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->has('navigation.main', 3)
            ->where('navigation.main.0.title', 'Dashboard')
            ->where('navigation.main.1.title', 'Lookups')
            ->where('navigation.main.2.title', 'Users')
        );
    }

    public function test_super_admin_cannot_access_register(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->get(route('pc-register.index'))
            ->assertForbidden();
    }

    public function test_ict_admin_navigation_includes_batches_and_register(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('navigation.main.1.title', 'Batches')
            ->where('navigation.main.2.title', 'Register')
        );
    }

    public function test_ict_admin_navigation_excludes_users(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user);

        $this->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->has('navigation.main', 6)
                ->where('navigation.main.4.title', 'PC Handover'));
    }
}
