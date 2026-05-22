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
            ['name' => 'ANS', 'code' => 'ANS'],
            ['name' => 'Aerodromes & Safety', 'code' => 'ASD'],
            ['name' => 'Economic Regulation', 'code' => 'ERD'],
            ['name' => 'Human Resource', 'code' => 'HRD'],
            ['name' => 'Finance', 'code' => 'FIN'],
            ['name' => 'Audit', 'code' => 'AUD'],
            ['name' => 'Legal', 'code' => 'LEG'],
            ['name' => 'Procurement', 'code' => 'PRO'],
            ['name' => 'Estate & Transport', 'code' => 'EST'],
            ['name' => 'AVSEC', 'code' => 'AVS'],
            ['name' => 'Public Affairs', 'code' => 'PAD'],
            ['name' => 'Training (GATA)', 'code' => 'GAT'],
            ['name' => 'Office of the DG', 'code' => 'ODG'],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(['code' => $dept['code']], $dept);
        }
    }
}
