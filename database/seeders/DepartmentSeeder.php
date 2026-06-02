<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'General Services', 'code' => 'GS'],
            ['name' => 'Air Traffic Safety Engineering', 'code' => 'ATSE'],
            ['name' => 'Air Traffic Services', 'code' => 'ATS'],
            ['name' => 'Safety Regulations', 'code' => 'SR'],
            ['name' => 'Economic Regulations And Business Development', 'code' => 'ERBD'],
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Finance', 'code' => 'FIN'],
            ['name' => 'Audit', 'code' => 'AUD'],
            ['name' => 'Legal and International Relation', 'code' => 'LIR'],
            ['name' => 'Corporate Planning', 'code' => 'CP'],
            ['name' => 'Finance and Administration Secretariat', 'code' => 'FAS'],
            ['name' => 'Technical Secretariat', 'code' => 'TS'],
            ['name' => 'DG Secretariat', 'code' => 'DGS'],
        ];

        // Deactivate old departments so they don't appear in lookups
        // but preserve them for existing records
        Department::query()->update(['is_active' => false]);

        foreach ($departments as $dept) {
            Department::updateOrCreate(['name' => $dept['name']], [
                'code' => $dept['code'],
                'is_active' => true,
            ]);
        }
    }
}
