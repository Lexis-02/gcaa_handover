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
        $ictAdmin->syncPermissions($permissions); // Give ICT admin all permissions

        $registryClerk = Role::updateOrCreate(['name' => 'registry_clerk'], ['guard_name' => 'web']);
        $registryClerk->syncPermissions([
            'pc.manage',
            'pc.view',
        ]);
    }
}
