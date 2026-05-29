<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Role priority
    |--------------------------------------------------------------------------
    | When a user has multiple roles, the first match wins for dashboard routing.
    */
    'role_priority' => [
        'super_admin',
        'ict_admin',
        'stores_officer',
        'director',
        'auditor',
        'registry_clerk',
        'end_user',
    ],

    /*
    |--------------------------------------------------------------------------
    | Role → dashboard definition
    |--------------------------------------------------------------------------
    */
    'roles' => [
        'super_admin' => [
            'title' => 'System Overview',
            'subtitle' => 'Full visibility across batches, PCs, and handover stages.',
            'greeting' => 'Welcome back',
        ],
        'ict_admin' => [
            'title' => 'ICT Operations',
            'subtitle' => 'Manage batches, assets, and handover pipeline.',
            'greeting' => 'Operations dashboard',
        ],
        'stores_officer' => [
            'title' => 'Stores & Stage 1',
            'subtitle' => 'Issue sign-offs and form generation for incoming PCs.',
            'greeting' => 'Stores dashboard',
        ],
        'director' => [
            'title' => 'Department Handover',
            'subtitle' => 'Stage 2 approvals and department-level progress.',
            'greeting' => 'Director dashboard',
        ],
        'end_user' => [
            'title' => 'My Handover',
            'subtitle' => 'Your assigned PC, acknowledgements, and old PC return.',
            'greeting' => 'My workspace',
        ],
        'registry_clerk' => [
            'title' => 'PC Registry',
            'subtitle' => 'Enter new PCs and track handover progress.',
            'greeting' => 'Clerk dashboard',
        ],
        'auditor' => [
            'title' => 'Audit & Compliance',
            'subtitle' => 'Read-only system view for audits and reporting.',
            'greeting' => 'Audit dashboard',
        ],
    ],

    'default_role' => 'end_user',

    /*
    |--------------------------------------------------------------------------
    | Role insight cards (title, body, CTA)
    |--------------------------------------------------------------------------
    */
    'insights' => [
        'super_admin' => [
            'title' => 'System administration',
            'body' => 'Manage lookup values, users, and organisation structure.',
            'cta' => 'Open users',
            'route' => 'users.index',
        ],
        'ict_admin' => [
            'title' => 'Operations focus',
            'body' => 'Track batches and the handover pipeline from issue to completion.',
            'cta' => 'View register',
            'route' => 'pc-register.index',
        ],
        'stores_officer' => [
            'title' => 'Stage 1 queue',
            'body' => 'PCs awaiting stores sign-off need your action before directors can approve.',
            'cta' => 'Open sign-offs',
            'route' => 'handover-sign-offs.index',
        ],
        'director' => [
            'title' => 'Department approvals',
            'body' => 'Review Stage 2 items for your department and keep handovers moving.',
            'cta' => 'Pending sign-offs',
            'route' => 'handover-sign-offs.index',
        ],
        'end_user' => [
            'title' => 'Your handover',
            'body' => 'Acknowledge receipt and complete old PC return when prompted.',
            'cta' => 'View my PCs',
            'route' => 'pc-register.index',
        ],
        'registry_clerk' => [
            'title' => 'Registry management',
            'body' => 'Enter PCs and monitor the completion of their handover stages.',
            'cta' => 'Register PC',
            'route' => 'pc-register.create',
        ],
        'auditor' => [
            'title' => 'Compliance view',
            'body' => 'Read-only visibility across assets, batches, and summary reports.',
            'cta' => 'Open summary',
            'route' => 'summary.index',
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
                'title' => 'Notifications',
                'description' => 'Alerts and handover updates',
                'icon' => 'bell',
                'route' => 'notifications.index',
                'badge_key' => 'unread_notifications',
            ],
            [
                'title' => 'Sign-offs',
                'description' => 'PCs waiting for signature',
                'icon' => 'clipboard-check',
                'route' => 'handover-sign-offs.index',
                'badge_key' => 'sign_off_queue',
            ],
            [
                'title' => 'PC register',
                'description' => 'Browse and manage assigned PCs',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.manage', 'pc.view', 'stage.manage-all'],
            ],
            [
                'title' => 'Summary',
                'description' => 'Pipeline and department reports',
                'icon' => 'bar-chart-3',
                'route' => 'summary.index',
                'permissions' => ['reports.all', 'reports.dept', 'stage.manage-all', 'pc.manage'],
            ],
        ],
        'stores_officer' => [
            [
                'title' => 'Sign-offs',
                'description' => 'Stage 1 stores approvals',
                'icon' => 'clipboard-check',
                'route' => 'handover-sign-offs.index',
                'badge_key' => 'sign_off_queue',
            ],
            [
                'title' => 'PC register',
                'description' => 'View registered assets',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.view', 'stage1.signoff'],
            ],
            [
                'title' => 'Notifications',
                'description' => 'Latest handover alerts',
                'icon' => 'bell',
                'route' => 'notifications.index',
                'badge_key' => 'unread_notifications',
            ],
        ],
        'director' => [
            [
                'title' => 'Sign-offs',
                'description' => 'Stage 2 department approvals',
                'icon' => 'clipboard-check',
                'route' => 'handover-sign-offs.index',
                'badge_key' => 'sign_off_queue',
            ],
            [
                'title' => 'PC register',
                'description' => 'Department handover assets',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.view-dept', 'stage2.signoff'],
            ],
            [
                'title' => 'Summary',
                'description' => 'Department progress overview',
                'icon' => 'bar-chart-3',
                'route' => 'summary.index',
                'permissions' => ['reports.dept'],
            ],
        ],
        'end_user' => [
            [
                'title' => 'My PCs',
                'description' => 'Assigned handover assets',
                'icon' => 'laptop',
                'route' => 'pc-register.index',
                'permissions' => ['pc.view-own', 'stage3.signoff'],
            ],
            [
                'title' => 'Sign-offs',
                'description' => 'Actions waiting on you',
                'icon' => 'clipboard-check',
                'route' => 'handover-sign-offs.index',
                'badge_key' => 'sign_off_queue',
            ],
            [
                'title' => 'Notifications',
                'description' => 'Handover reminders',
                'icon' => 'bell',
                'route' => 'notifications.index',
                'badge_key' => 'unread_notifications',
            ],
        ],
        'auditor' => [
            [
                'title' => 'Summary',
                'description' => 'System-wide handover reports',
                'icon' => 'bar-chart-3',
                'route' => 'summary.index',
                'permissions' => ['reports.all'],
            ],
            [
                'title' => 'PC register',
                'description' => 'Read-only asset listing',
                'icon' => 'monitor',
                'route' => 'pc-register.index',
                'permissions' => ['pc.view'],
            ],
            [
                'title' => 'Batches',
                'description' => 'Handover batch overview',
                'icon' => 'package',
                'route' => 'batches.index',
                'permissions' => ['batch.create'],
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
                'title' => 'Notifications',
                'description' => 'Handover reminders',
                'icon' => 'bell',
                'route' => 'notifications.index',
                'badge_key' => 'unread_notifications',
            ],
        ],
        'super_admin' => [
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
        ],
    ],
];
