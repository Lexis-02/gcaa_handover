<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\LookupValue;
use App\Models\User;
use Database\Seeders\LookupValueSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LookupsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolesAndPermissionsSeeder::class,
            LookupValueSeeder::class,
        ]);
    }

    public function test_super_admin_can_manage_departments(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->get(route('lookups.departments.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('lookups/departments/index'));

        $this->actingAs($user)
            ->post(route('lookups.departments.store'), [
                'name' => 'Test Dept',
                'code' => 'TST',
                'is_active' => true,
            ])
            ->assertRedirect(route('lookups.departments.index'));

        $this->assertDatabaseHas('departments', ['code' => 'TST']);
    }

    public function test_ict_admin_cannot_access_lookups(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user)
            ->get(route('lookups.departments.index'))
            ->assertForbidden();
    }

    public function test_pc_conditions_come_from_database_in_register_form(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        LookupValue::query()->create([
            'type' => 'pc_condition',
            'label' => 'Custom Condition',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->get(route('pc-register.create'));

        $response->assertOk();
        $conditions = collect($response->original->getData()['page']['props']['options']['conditions']);
        $this->assertTrue($conditions->contains('Custom Condition'));
    }

    public function test_super_admin_can_manage_pc_conditions(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->post(route('lookups.values.store', ['type' => 'pc-conditions']), [
                'label' => 'Test Condition',
                'sort_order' => 10,
                'is_active' => true,
            ])
            ->assertRedirect(route('lookups.values.index', ['type' => 'pc-conditions']));

        $this->assertDatabaseHas('lookup_values', [
            'type' => 'pc_condition',
            'label' => 'Test Condition',
        ]);
    }
}
