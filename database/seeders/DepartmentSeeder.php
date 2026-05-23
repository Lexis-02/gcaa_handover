<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'ICT', 'code' => 'ICT'],
            ['name' => 'Air Navigation Services (ANS)', 'code' => 'ANS'],
            ['name' => 'Aerodromes & Aviation Safety', 'code' => 'ASD'],
            ['name' => 'Economic Regulation', 'code' => 'ERD'],
            ['name' => 'Human Resource', 'code' => 'HRD'],
            ['name' => 'Finance', 'code' => 'FIN'],
            ['name' => 'Audit', 'code' => 'AUD'],
            ['name' => 'Legal', 'code' => 'LEG'],
            ['name' => 'Procurement', 'code' => 'PRO'],
            ['name' => 'Estate & Transport', 'code' => 'EST'],
            ['name' => 'Aviation Security (AVSEC)', 'code' => 'AVS'],
            ['name' => 'Public Affairs', 'code' => 'PAD'],
            ['name' => 'Training (GATA)', 'code' => 'GAT'],
            ['name' => 'Office of the DG', 'code' => 'ODG'],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(['code' => $dept['code']], [
                'name' => $dept['name'],
                'is_active' => true,
            ]);
        }
    }
}
