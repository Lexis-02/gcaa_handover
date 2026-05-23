<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Database\Seeder;

class BatchSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::query()->where('username', 'ictadmin')->first()
            ?? User::query()->first();

        if (! $creator) {
            return;
        }

        Batch::updateOrCreate(
            ['batch_code' => 'GCAA-2026-B01'],
            [
                'year' => 2026,
                'total_pcs' => 56,
                'serial_from' => '001',
                'serial_to' => '056',
                'notes' => 'Initial handover batch — replaces Excel register',
                'created_by' => $creator->id,
            ]
        );
    }
}
