<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserInvitation;
use App\Services\UserInvitationService;
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
            ->assertInertia(fn ($page) => $page
                ->component('users/index')
                ->has('records.data'));
    }

    public function test_super_admin_can_view_registration_links_page(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->get(route('users.invitations.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('users/invitations/index')
                ->has('invitations')
                ->has('options'));
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
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'username' => 'teststores',
        ]);
    }

    public function test_super_admin_can_view_edit_and_show_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $target = User::factory()->create(['name' => 'Target User']);
        $target->assignRole('end_user');

        $this->actingAs($admin)
            ->get(route('users.show', $target))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('users/show')
                ->where('record.name', 'Target User'));

        $this->actingAs($admin)
            ->get(route('users.edit', $target))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('users/edit'));
    }

    public function test_super_admin_can_generate_invitation_link(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $this->actingAs($admin)
            ->post(route('users.invitations.store'), [
                'role' => 'stores_officer',
                'label' => 'New stores hire',
            ])
            ->assertRedirect(route('users.invitations.index'));

        $this->assertDatabaseHas('user_invitations', [
            'role' => 'stores_officer',
            'label' => 'New stores hire',
            'created_by' => $admin->id,
        ]);
    }

    public function test_signed_registration_link_allows_register_form(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $invitation = app(UserInvitationService::class)->create($admin, [
            'role' => 'end_user',
        ]);

        $url = app(UserInvitationService::class)->signedRegistrationUrl($invitation);

        $this->get($url)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('auth/register')
                ->where('invitation.role', 'end_user'));
    }

    public function test_registration_consumes_invitation_and_assigns_role(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $invitation = app(UserInvitationService::class)->create($admin, [
            'role' => 'director',
        ]);

        $url = app(UserInvitationService::class)->signedRegistrationUrl($invitation);
        $parsed = parse_url($url);
        parse_str($parsed['query'] ?? '', $query);

        $this->post($parsed['path'].'?'.http_build_query($query), [
            'name' => 'Invited Director',
            'username' => 'inviteddir',
            'password' => 'SecurePass1!',
            'password_confirmation' => 'SecurePass1!',
        ])->assertRedirect(config('fortify.home'));

        $user = User::query()->where('username', 'inviteddir')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('director'));

        $invitation->refresh();
        $this->assertNotNull($invitation->used_at);
        $this->assertSame($user->id, $invitation->user_id);
    }

    public function test_used_invitation_link_is_rejected(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $invitation = UserInvitation::query()->create([
            'created_by' => $admin->id,
            'role' => 'end_user',
            'expires_at' => now()->addDay(),
            'used_at' => now(),
        ]);

        $url = app(UserInvitationService::class)->signedRegistrationUrl($invitation);

        $this->get($url)->assertForbidden();
    }

    public function test_register_without_invitation_redirects_to_login(): void
    {
        $this->get('/register')->assertRedirect('/login');
    }
}
