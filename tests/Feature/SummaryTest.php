<?php

namespace Tests\Feature;

use App\Models\Batch;
use App\Models\Department;
use App\Models\PcAsset;
use App\Models\User;
use Database\Seeders\BatchSeeder;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SummaryTest extends TestCase
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

    public function test_auditor_can_view_summary(): void
    {
        $user = User::query()->where('username', 'auditor')->first();

        $this->actingAs($user)
            ->get(route('summary.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('summary/index')
                ->where('summary.view_mode', 'all')
                ->has('summary.pipeline', 5)
                ->has('summary.batch_comparison', 1)
                ->has('summary.by_department', 14)
                ->where('summary.overall.total_in_batch', 56));

        $batch = Batch::query()->first();

        $this->actingAs($user)
            ->get(route('summary.index', ['batch' => $batch->id]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.view_mode', 'batch')
                ->where('summary.batch.id', $batch->id));
    }

    public function test_director_sees_department_scoped_summary(): void
    {
        $user = User::query()->where('username', 'director_hr')->first();
        $batch = Batch::query()->first();
        $department = Department::query()->where('id', $user->department_id)->first();

        PcAsset::query()->create([
            'batch_id' => $batch->id,
            'ref_no' => 'GCAA-PC-2026-050',
            'make_model' => 'HP EliteBook',
            'serial_number' => 'SN-SUM-001',
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'complete',
            'department_id' => $department->id,
        ]);

        $this->actingAs($user)
            ->get(route('summary.index', ['batch' => $batch->id]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('summary.view_mode', 'batch')
                ->where('summary.scoped_to_department', true)
                ->has('summary.by_department', 1)
                ->where('summary.overall.complete', 1));
    }

    public function test_end_user_cannot_view_summary(): void
    {
        $user = User::query()->where('username', 'enduser')->first();

        $this->actingAs($user)
            ->get(route('summary.index'))
            ->assertForbidden();
    }
}
