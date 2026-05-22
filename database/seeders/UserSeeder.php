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

        // 1. Super Admin (General configuration)
        $superAdminUser = User::create([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $superAdminUser->assignRole('super_admin');

        // 2. Auditor (Full read-only)
        $auditorUser = User::create([
            'name' => 'Auditor General',
            'username' => 'auditor',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $auditorUser->assignRole('auditor');

        // 3. ICT Admin / Network Engineer
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

        // 4. Stores Officer
        $storesUser = User::create([
            'name' => 'Ama Serwaa',
            'username' => 'storesofficer',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $storesUser->assignRole('stores_officer');

        $storesStaff = Staff::create([
            'full_name' => 'Ama Serwaa',
            'staff_number' => 'GCAA-STF-002',
            'designation' => 'ICT Stores Officer',
            'department_id' => $ict->id,
            'building_id' => $hq->id,
            'email' => 'stores@gcaa.com.gh',
            'phone' => '0247654321',
            'user_id' => $storesUser->id,
        ]);
        $storesUser->update(['staff_id' => $storesStaff->id, 'department_id' => $ict->id]);

        // 5. Department Director - ICT
        $ictDirectorUser = User::create([
            'name' => 'Dr. Yaw Asante',
            'username' => 'director_ict',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $ictDirectorUser->assignRole('director');

        $ictDirectorStaff = Staff::create([
            'full_name' => 'Dr. Yaw Asante',
            'staff_number' => 'GCAA-STF-003',
            'designation' => 'Director of ICT',
            'department_id' => $ict->id,
            'building_id' => $hq->id,
            'email' => 'ict.director@gcaa.com.gh',
            'phone' => '0209998887',
            'user_id' => $ictDirectorUser->id,
        ]);
        $ictDirectorUser->update(['staff_id' => $ictDirectorStaff->id, 'department_id' => $ict->id]);
        $ict->update(['director_staff_id' => $ictDirectorStaff->id]);

        // 6. Department Director - HR
        $hrDirectorUser = User::create([
            'name' => 'Mad. Elizabeth Osei',
            'username' => 'director_hr',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $hrDirectorUser->assignRole('director');

        $hrDirectorStaff = Staff::create([
            'full_name' => 'Mad. Elizabeth Osei',
            'staff_number' => 'GCAA-STF-004',
            'designation' => 'Director of HR',
            'department_id' => $hr->id,
            'building_id' => $hq->id,
            'email' => 'hr.director@gcaa.com.gh',
            'phone' => '0204445556',
            'user_id' => $hrDirectorUser->id,
        ]);
        $hrDirectorUser->update(['staff_id' => $hrDirectorStaff->id, 'department_id' => $hr->id]);
        $hr->update(['director_staff_id' => $hrDirectorStaff->id]);

        // 7. Regular End User (Staff member receiving PC)
        $endUser = User::create([
            'name' => 'Kwame Boateng',
            'username' => 'enduser',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $endUser->assignRole('end_user');

        $endStaff = Staff::create([
            'full_name' => 'Kwame Boateng',
            'staff_number' => 'GCAA-STF-005',
            'designation' => 'Human Resource Officer',
            'department_id' => $hr->id,
            'building_id' => $gata->id,
            'email' => 'staff.user@gcaa.com.gh',
            'phone' => '0245556667',
            'user_id' => $endUser->id,
        ]);
        $endUser->update(['staff_id' => $endStaff->id, 'department_id' => $hr->id]);
        
        // Let's seed a few more staff records that don't have accounts yet (to test assignment)
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
