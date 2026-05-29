<?php

namespace Database\Seeders;

use App\Models\LookupValue;
use Illuminate\Database\Seeder;

class LookupValueSeeder extends Seeder
{
    public function run(): void
    {
        $sets = [
            'pc_condition' => [
                'Sealed/New',
                'Inspected & Working',
                'Minor Defect',
                'Faulty on Arrival',
            ],
            'old_pc_condition' => [
                'Working',
                'Partially Working',
                'Faulty',
                'Beyond Repair',
            ],
            'yes_no' => [
                'Yes',
                'No',
                'N/A',
            ],
            'os' => [
                'Windows 10 Pro',
                'Windows 11 Pro',
                'macOS',
                'Ubuntu Linux',
            ],
        ];

        foreach ($sets as $type => $labels) {
            foreach ($labels as $index => $label) {
                LookupValue::updateOrCreate(
                    ['type' => $type, 'label' => $label],
                    ['sort_order' => $index + 1, 'is_active' => true]
                );
            }
        }
    }
}
