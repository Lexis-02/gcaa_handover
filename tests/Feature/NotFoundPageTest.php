<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotFoundPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_guest_sees_custom_not_found_page(): void
    {
        $this->get('/this-route-does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page
                ->component('errors/not-found')
                ->where('status', 404));
    }

    public function test_authenticated_user_sees_custom_not_found_page(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user)
            ->get('/missing-handover-page')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page
                ->component('errors/not-found')
                ->where('status', 404));
    }
}
