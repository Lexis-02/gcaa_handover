<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch lookup items
        $hq = Building::where('name', 'HQ')->first();
        $gata = Building::where('name', 'GATA')->first();

        $ict = Department::where('code', 'ICT')->first();
        $hr = Department::where('code', 'HRD')->first();

        // 1. ICT Admin / Network Engineer
        $ictAdminUser = User::create([
            'name' => 'Kofi Mensah',
            'username' => 'ictadmin',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $ictAdminUser->assignRole('ict_admin');

        $ictAdminStaff = Staff::create([
            'full_name' => 'Kofi Mensah',
            'staff_number' => 'GCAA-STF-001',
            'designation' => 'Network Engineer',
            'department_id' => $ict->id,
            'building_id' => $hq->id,
            'email' => 'admin@gcaa.com.gh',
            'phone' => '0241234567',
            'user_id' => $ictAdminUser->id,
        ]);
        $ictAdminUser->update(['staff_id' => $ictAdminStaff->id, 'department_id' => $ict->id]);

        // 2. Registry Clerk / Sub Admin
        $registryClerkUser = User::create([
            'name' => 'Ama Serwaa',
            'username' => 'registryclerk',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $registryClerkUser->assignRole('registry_clerk');

        $registryClerkStaff = Staff::create([
            'full_name' => 'Ama Serwaa',
            'staff_number' => 'GCAA-STF-002',
            'designation' => 'Registry Clerk',
            'department_id' => $ict->id,
            'building_id' => $hq->id,
            'email' => 'registry@gcaa.com.gh',
            'phone' => '0247654321',
            'user_id' => $registryClerkUser->id,
        ]);
        $registryClerkUser->update(['staff_id' => $registryClerkStaff->id, 'department_id' => $ict->id]);

        // Seed a few more staff records that don't have accounts yet (to test assignment)
        Staff::create([
            'full_name' => 'Abena Mansa',
            'staff_number' => 'GCAA-STF-006',
            'designation' => 'IT Support Technician',
            'department_id' => $ict->id,
            'building_id' => $hq->id,
            'email' => 'abena@gcaa.com.gh',
            'phone' => '0249998881',
        ]);

        Staff::create([
            'full_name' => 'John Mahama',
            'staff_number' => 'GCAA-STF-007',
            'designation' => 'HR Specialist',
            'department_id' => $hr->id,
            'building_id' => $gata->id,
            'email' => 'john@gcaa.com.gh',
            'phone' => '0201112223',
        ]);
    }
}
