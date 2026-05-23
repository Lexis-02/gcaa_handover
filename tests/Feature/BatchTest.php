<?php

namespace Tests\Feature;

use App\Models\Batch;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BatchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_ict_admin_can_create_batch(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user)
            ->post(route('batches.store'), [
                'year' => 2026,
                'total_pcs' => 56,
                'serial_from' => '001',
                'notes' => 'Test batch',
            ])
            ->assertRedirect(route('batches.index'));

        $this->assertDatabaseHas('batches', [
            'batch_code' => 'GCAA-2026-B01',
            'year' => 2026,
            'total_pcs' => 56,
            'serial_from' => '001',
            'serial_to' => '056',
        ]);
    }

    public function test_super_admin_cannot_create_batch(): void
    {
        $user = User::factory()->create();
        $user->assignRole('super_admin');

        $this->actingAs($user)
            ->get(route('batches.index'))
            ->assertForbidden();
    }

    public function test_ict_admin_can_view_and_delete_empty_batch(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->actingAs($user)
            ->post(route('batches.store'), [
                'year' => 2027,
                'total_pcs' => 10,
                'serial_from' => '001',
            ]);

        $batch = Batch::query()->where('year', 2027)->first();

        $this->actingAs($user)
            ->get(route('batches.show', $batch))
            ->assertOk();

        $this->actingAs($user)
            ->delete(route('batches.destroy', $batch))
            ->assertRedirect(route('batches.index'));

        $this->assertDatabaseMissing('batches', ['id' => $batch->id]);
    }

    public function test_ict_admin_cannot_access_users_nav_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole('ict_admin');

        $this->assertFalse($user->can('users.manage'));
    }
}
