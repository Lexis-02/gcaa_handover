<?php

namespace Tests\Feature;

use App\Models\Batch;
use App\Models\OldPcReturn;
use App\Models\PcAsset;
use App\Models\Staff;
use App\Models\User;
use Database\Seeders\BatchSeeder;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\LookupValueSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PcHandoverTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            BuildingSeeder::class,
            DepartmentSeeder::class,
            LookupValueSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            BatchSeeder::class,
        ]);
    }

    public function test_stores_officer_can_view_pc_handover_index(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->get(route('pc-handover.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('pc-handover/index'));
    }

    public function test_end_user_can_submit_old_pc_handover(): void
    {
        $user = User::query()->where('username', 'enduser')->first();
        $batch = Batch::query()->first();
        $staff = Staff::query()->where('id', $user->staff_id)->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-200',
            'make_model' => 'Dell Latitude 5540',
            'serial_number' => 'SN-HANDOVER-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
            'assigned_staff_id' => $staff->id,
            'department_id' => $staff->department_id,
        ]);

        $this->actingAs($user)
            ->post(route('pc-handover.store'), [
                'pc_asset_id' => $asset->id,
                'old_asset_tag' => 'OLD-12345',
                'old_make_model' => 'HP ProBook 450',
                'old_serial_no' => 'OLD-SN-999',
                'year_of_purchase' => 2019,
                'condition' => 'Faulty',
                'reason_for_replacement' => 'Battery failure and slow performance.',
                'data_wiped' => 'Yes',
                'returned_to_stores' => 'No',
            ])
            ->assertRedirect(route('pc-handover.index'));

        $this->assertDatabaseHas('old_pc_returns', [
            'pc_asset_id' => $asset->id,
            'staff_id' => $staff->id,
            'old_serial_no' => 'OLD-SN-999',
            'condition' => 'Faulty',
            'data_wiped' => 'Yes',
            'returned_to_stores' => 'No',
        ]);
    }

    public function test_ict_admin_can_update_old_pc_handover(): void
    {
        $user = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();
        $staff = Staff::query()->first();

        $asset = PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-201',
            'make_model' => 'Lenovo ThinkPad',
            'serial_number' => 'SN-HANDOVER-002',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
            'assigned_staff_id' => $staff->id,
            'department_id' => $staff->department_id,
        ]);

        $return = OldPcReturn::query()->create([
            'pc_asset_id' => $asset->id,
            'staff_id' => $staff->id,
            'old_make_model' => 'Old HP',
            'old_serial_no' => 'OLD-1',
            'condition' => 'Working',
            'data_wiped' => 'No',
            'returned_to_stores' => 'No',
        ]);

        $this->actingAs($user)
            ->put(route('pc-handover.update', $return), [
                'old_make_model' => 'Old HP EliteBook',
                'old_serial_no' => 'OLD-1',
                'condition' => 'Beyond Repair',
                'data_wiped' => 'Yes',
                'returned_to_stores' => 'Yes',
            ])
            ->assertRedirect(route('pc-handover.index'));

        $return->refresh();
        $this->assertSame('Beyond Repair', $return->condition);
        $this->assertSame('Yes', $return->data_wiped);
        $this->assertSame('Yes', $return->returned_to_stores);
        $this->assertTrue($return->isFullyReturned());
    }
}
