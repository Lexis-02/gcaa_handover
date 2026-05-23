<?php

namespace Tests\Feature;

use App\Models\Batch;
use App\Models\PcAsset;
use App\Models\User;
use App\Notifications\HandoverActionRequired;
use Database\Seeders\BatchSeeder;
use Database\Seeders\BuildingSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class HandoverNotificationTest extends TestCase
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

    public function test_creating_pc_notifies_stores_officer(): void
    {
        Notification::fake();

        $admin = User::query()->where('username', 'ictadmin')->first();
        $batch = Batch::query()->first();

        $this->actingAs($admin)
            ->post(route('pc-register.store'), [
                'batch_id' => $batch->id,
                'make_model' => 'Dell Latitude',
                'serial_number' => 'SN-NOTIFY-001',
                'os' => 'Windows 11 Pro',
                'condition_on_issue' => 'Sealed/New',
            ])
            ->assertRedirect(route('pc-register.index'));

        $stores = User::query()->where('username', 'storesofficer')->first();

        Notification::assertSentTo($stores, HandoverActionRequired::class);
    }

    public function test_stores_officer_can_open_notifications_page(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->get(route('notifications.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('notifications/index'));
    }

    public function test_notifications_poll_endpoint_returns_json(): void
    {
        $user = User::query()->where('username', 'storesofficer')->first();

        $this->actingAs($user)
            ->getJson(route('notifications.poll'))
            ->assertOk()
            ->assertJsonStructure(['unread_count', 'new', 'latest_id']);
    }
}
