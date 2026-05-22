<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'batch.create',
            'pc.manage',
            'stage.manage-all',
            'reports.all',
            'users.manage',
            'forms.generate',
            'stage1.signoff',
            'pc.view',
            'stage2.signoff',
            'pc.view-dept',
            'reports.dept',
            'stage3.signoff',
            'pc.view-own',
            'old-pc.submit',
            'audit-log.view',
            'config.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission], ['guard_name' => 'web']);
        }

        // create roles and assign existing permissions
        $ictAdmin = Role::updateOrCreate(['name' => 'ict_admin'], ['guard_name' => 'web']);
        $ictAdmin->syncPermissions([
            'batch.create',
            'pc.manage',
            'stage.manage-all',
            'reports.all',
            'users.manage',
            'forms.generate',
        ]);

        $storesOfficer = Role::updateOrCreate(['name' => 'stores_officer'], ['guard_name' => 'web']);
        $storesOfficer->syncPermissions([
            'stage1.signoff',
            'pc.view',
            'forms.generate',
        ]);

        $director = Role::updateOrCreate(['name' => 'director'], ['guard_name' => 'web']);
        $director->syncPermissions([
            'stage2.signoff',
            'pc.view-dept',
            'reports.dept',
        ]);

        $endUser = Role::updateOrCreate(['name' => 'end_user'], ['guard_name' => 'web']);
        $endUser->syncPermissions([
            'stage3.signoff',
            'pc.view-own',
            'old-pc.submit',
        ]);

        $auditor = Role::updateOrCreate(['name' => 'auditor'], ['guard_name' => 'web']);
        $auditor->syncPermissions([
            'pc.view',
            'reports.all',
            'audit-log.view',
        ]);

        $superAdmin = Role::updateOrCreate(['name' => 'super_admin'], ['guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());
    }
}
