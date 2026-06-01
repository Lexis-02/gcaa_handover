<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Role priority
    |--------------------------------------------------------------------------
    | When a user has multiple roles, the first match wins for dashboard routing.
    */
    'role_priority' => [
        'ict_admin',
        'registry_clerk',
    ],

    /*
    |--------------------------------------------------------------------------
    | Role → dashboard definition
    |--------------------------------------------------------------------------
    */
    'roles' => [
        'ict_admin' => [
            'title' => 'System Overview',
            'subtitle' => 'Full visibility and control across batches, PCs, and registry.',
            'greeting' => 'Welcome back',
        ],
        'registry_clerk' => [
            'title' => 'PC Registry',
            'subtitle' => 'Enter new PCs and track handover progress.',
            'greeting' => 'Clerk dashboard',
        ],
    ],

    'default_role' => 'registry_clerk',

    /*
    |--------------------------------------------------------------------------
    | Role insight cards (title, body, CTA)
    |--------------------------------------------------------------------------
    */
    'insights' => [
        'ict_admin' => [
            'title' => 'System administration',
            'body' => 'Manage lookup values, users, and oversee the entire registry pipeline.',
            'cta' => 'Open users',
            'route' => 'users.index',
        ],
        'registry_clerk' => [
            'title' => 'Registry management',
            'body' => 'Enter PCs and monitor the completion of their handover stages.',
            'cta' => 'Register PC',
            'route' => 'pc-register.create',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Quick links (filtered by permissions when set)
    |--------------------------------------------------------------------------
    */
    'quick_links' => [
        'default' => [
            [
                'title' => 'Handover guide',
                'description' => 'Step-by-step process reference',
                'icon' => 'book-open',
                'route' => 'handover.guide',
            ],
        ],
        'ict_admin' => [
            [
                'title' => 'PC register',
                'description' => 'Browse and manage all assigned PCs',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.manage', 'pc.view', 'stage.manage-all'],
            ],
            [
                'title' => 'Users',
                'description' => 'Manage accounts and roles',
                'icon' => 'users',
                'route' => 'users.index',
                'permissions' => ['users.manage'],
            ],
            [
                'title' => 'Departments',
                'description' => 'Organisation lookup values',
                'icon' => 'building-2',
                'route' => 'lookups.departments.index',
                'permissions' => ['config.manage'],
            ],
            [
                'title' => 'Batches',
                'description' => 'Manage handover batches',
                'icon' => 'package',
                'route' => 'batches.index',
                'permissions' => ['batch.create'],
            ],
            [
                'title' => 'Summary',
                'description' => 'Pipeline and department reports',
                'icon' => 'bar-chart-3',
                'route' => 'summary.index',
                'permissions' => ['reports.all', 'reports.dept', 'stage.manage-all', 'pc.manage'],
            ],
        ],
        'registry_clerk' => [
            [
                'title' => 'Register new PC',
                'description' => 'Add a new asset to the registry',
                'icon' => 'monitor',
                'route' => 'pc-register.create',
                'permissions' => ['pc.manage'],
            ],
            [
                'title' => 'PC register',
                'description' => 'Browse and manage your registered PCs',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.manage'],
            ],
            [
                'title' => 'Batches',
                'description' => 'View handover batches',
                'icon' => 'package',
                'route' => 'batches.index',
            ],
        ],
    ],
];
