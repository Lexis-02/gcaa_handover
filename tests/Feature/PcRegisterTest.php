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

class PcRegisterTest extends TestCase
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

    public function test_ict_admin_can_view_register_index(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();

        $this->actingAs($user)
            ->get(route('pc-register.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('pc-register/index'));
    }

    public function test_ict_admin_can_create_pc_record(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $this->actingAs($user)
            ->post(route('pc-register.store'), [
                'batch_id' => $batch->id,
                'make_model' => 'Dell Latitude 5540',
                'serial_number' => 'SN-TEST-001',
                'os' => 'Windows 11 Pro',
                'condition_on_issue' => 'Sealed/New',
            ])
            ->assertRedirect(route('pc-register.index'));

        $this->assertDatabaseHas('pc_assets', [
            'ref_no' => 'GCAA-PC-2026-001',
            'serial_number' => 'SN-TEST-001',
            'status' => 'pending',
        ]);
    }

    public function test_end_user_cannot_create_pc_record(): void
    {
        $user = User::query()->where('username', 'enduser')->first();
        $batch = Batch::query()->first();

        $this->actingAs($user)
            ->get(route('pc-register.create'))
            ->assertForbidden();
    }

    public function test_pending_pc_can_be_edited_by_ict_admin(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-099',
            'make_model' => 'HP EliteBook',
            'serial_number' => 'SN-EDIT-001',
            'os' => 'Windows 10 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->put(route('pc-register.update', $asset), [
                'make_model' => 'HP EliteBook 840',
                'serial_number' => 'SN-EDIT-001',
                'os' => 'Windows 11 Pro',
                'condition_on_issue' => 'Inspected & Working',
            ])
            ->assertRedirect(route('pc-register.show', $asset));

        $this->assertDatabaseHas('pc_assets', [
            'id' => $asset->id,
            'make_model' => 'HP EliteBook 840',
        ]);
    }

    public function test_register_index_search_filters_records(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-050',
            'make_model' => 'Dell OptiPlex',
            'serial_number' => 'SN-SEARCH-050',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-051',
            'make_model' => 'HP ProDesk',
            'serial_number' => 'SN-SEARCH-051',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->get(route('pc-register.index', ['q' => '050']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('records.data', 1)
                ->where('records.data.0.ref_no', 'GCAA-PC-2026-050')
                ->where('filters.q', '050')
            );
    }

    public function test_register_status_filter_pending(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-070',
            'make_model' => 'Pending PC',
            'serial_number' => 'SN-FILTER-1',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-071',
            'make_model' => 'Complete PC',
            'serial_number' => 'SN-FILTER-2',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'complete',
        ]);

        $this->actingAs($user)
            ->get(route('pc-register.index', ['status' => 'pending']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('filters.status', 'pending')
                ->where('records.data.0.status', 'pending')
            );
    }

    public function test_pending_pc_awaits_stores_officer_sign_off(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-052',
            'make_model' => 'Lenovo',
            'serial_number' => 'SN-NEXT-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->get(route('pc-register.show', $asset))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('record.next_signer', 'ICT Stores Officer')
                ->where('meta.sign_off', null)
                ->where('meta.handover_oversight.stage', 1)
            );
    }

    public function test_signed_pc_cannot_be_edited(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-098',
            'make_model' => 'Lenovo ThinkPad',
            'serial_number' => 'SN-LOCK-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'stage_1_complete',
        ]);

        $this->actingAs($user)
            ->get(route('pc-register.edit', $asset))
            ->assertRedirect(route('pc-register.show', $asset));
    }
}
