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
        'auditor' => [
            'title' => 'Audit & Compliance',
            'subtitle' => 'Read-only system view for audits and reporting.',
            'greeting' => 'Audit dashboard',
        ],
    ],

    'default_role' => 'end_user',
];
