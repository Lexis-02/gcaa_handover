<?php

namespace Tests\Feature;

use App\Models\Batch;
use App\Models\PcAsset;
use App\Models\User;
use Database\Seeders\BatchSeeder;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HandoverSignOffTest extends TestCase
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
            BatchSeeder::class,
        ]);
    }

    public function test_stores_officer_can_view_sign_off_queue(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->get(route('handover-sign-offs.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('handover-sign-offs/index'));
    }

    public function test_stores_officer_can_sign_stage_one(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-060',
            'make_model' => 'Dell Latitude',
            'serial_number' => 'SN-SIGN-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->post(route('pc-register.sign-off.store', $asset))
            ->assertRedirect(route('handover-sign-offs.index'));

        $this->assertDatabaseHas('handover_stages', [
            'pc_asset_id' => $asset->id,
            'stage' => 1,
            'actioned_by' => $user->id,
        ]);

        $asset->refresh();
        $this->assertSame('stage_1_complete', $asset->status);
    }

    public function test_stores_officer_cannot_delete_pc(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-061',
            'make_model' => 'HP',
            'serial_number' => 'SN-DEL-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->delete(route('pc-register.destroy', $asset))
            ->assertForbidden();
    }

    public function test_ict_admin_can_delete_pending_pc_without_sign_offs(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-062',
            'make_model' => 'Lenovo',
            'serial_number' => 'SN-DEL-002',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->delete(route('pc-register.destroy', $asset))
            ->assertRedirect(route('pc-register.index'));

        $this->assertDatabaseMissing('pc_assets', ['id' => $asset->id]);
    }

    public function test_stores_officer_queue_excludes_pc_after_stage_one_sign_off(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-080',
            'make_model' => 'Dell',
            'serial_number' => 'SN-QUEUE-1',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->post(route('pc-register.sign-off.store', $asset))
            ->assertRedirect();

        $response = $this->actingAs($user)
            ->get(route('handover-sign-offs.index'))
            ->assertOk();

        $ids = collect($response->original->getData()['page']['props']['records']['data'])
            ->pluck('id');

        $this->assertFalse($ids->contains($asset->id));
    }

    public function test_handover_guide_page_is_available(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->get(route('handover.guide'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('handover/guide'));
    }
}
