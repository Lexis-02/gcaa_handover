<?php

$registerChildren = [
    [
        'title' => 'View',
        'route' => 'pc-register.index',
        'icon' => 'eye',
        'match' => 'exact',
        'permissions' => ['pc.view', 'pc.view-dept', 'pc.view-own', 'stage.manage-all'],
    ],
    [
        'title' => 'Sign-offs',
        'route' => 'handover-sign-offs.index',
        'icon' => 'clipboard-check',
        'match' => 'exact',
        'permissions' => ['stage1.signoff', 'stage2.signoff', 'stage3.signoff', 'stage.manage-all'],
    ],
    [
        'title' => 'Add',
        'route' => 'pc-register.create',
        'icon' => 'plus',
        'match' => 'exact',
        'permissions' => ['pc.manage'],
    ],
    [
        'title' => 'Edit',
        'route' => 'pc-register.index',
        'icon' => 'pencil',
        'match' => 'edit',
        'permissions' => ['pc.manage'],
    ],
];

$handoverGuidePermissions = [
    'pc.view',
    'pc.view-dept',
    'pc.view-own',
    'pc.manage',
    'stage.manage-all',
    'stage1.signoff',
    'stage2.signoff',
    'stage3.signoff',
];

$batchChildren = [
    [
        'title' => 'View',
        'route' => 'batches.index',
        'icon' => 'eye',
        'match' => 'exact',
        'permissions' => ['batch.create'],
    ],
    [
        'title' => 'Add',
        'route' => 'batches.create',
        'icon' => 'plus',
        'permissions' => ['batch.create'],
    ],
];

$usersChildren = [
    [
        'title' => 'View',
        'route' => 'users.index',
        'icon' => 'eye',
        'match' => 'exact',
        'permissions' => ['users.manage'],
    ],
    [
        'title' => 'Registration links',
        'route' => 'users.invitations.index',
        'icon' => 'link-2',
        'match' => 'exact',
        'permissions' => ['users.manage'],
    ],
    [
        'title' => 'Add',
        'route' => 'users.create',
        'icon' => 'plus',
        'permissions' => ['users.manage'],
    ],
];

$lookupChildren = [
    [
        'title' => 'Departments',
        'route' => 'lookups.departments.index',
        'icon' => 'eye',
        'match' => 'exact',
        'permissions' => ['config.manage'],
    ],
    [
        'title' => 'PC Condition',
        'route' => 'lookups.values.index',
        'route_params' => ['type' => 'pc-conditions'],
        'icon' => 'eye',
        'permissions' => ['config.manage'],
    ],
    [
        'title' => 'Old PC Condition',
        'route' => 'lookups.values.index',
        'route_params' => ['type' => 'old-pc-conditions'],
        'icon' => 'eye',
        'permissions' => ['config.manage'],
    ],
    [
        'title' => 'Yes / No',
        'route' => 'lookups.values.index',
        'route_params' => ['type' => 'yes-no'],
        'icon' => 'eye',
        'permissions' => ['config.manage'],
    ],
    [
        'title' => 'Buildings',
        'route' => 'lookups.buildings.index',
        'icon' => 'eye',
        'match' => 'exact',
        'permissions' => ['config.manage'],
    ],
];

return [

    'main' => [
        [
            'title' => 'Dashboard',
            'route' => 'dashboard',
            'icon' => 'layout-grid',
        ],
        [
            'title' => 'Notifications',
            'route' => 'notifications.index',
            'icon' => 'bell',
            'permissions' => [
                'stage1.signoff',
                'stage2.signoff',
                'stage3.signoff',
                'old-pc.submit',
                'pc.manage',
                'stage.manage-all',
            ],
        ],
        [
            'title' => 'Batches',
            'slug' => 'batches',
            'icon' => 'package',
            'permissions' => ['batch.create'],
            'children' => $batchChildren,
        ],
        [
            'title' => 'Register',
            'slug' => 'register',
            'icon' => 'clipboard-plus',
            'permissions' => ['pc.view', 'pc.view-dept', 'pc.view-own', 'pc.manage', 'stage.manage-all', 'stage1.signoff', 'stage2.signoff', 'stage3.signoff'],
            'children' => $registerChildren,
        ],
        [
            'title' => 'Handover guide',
            'route' => 'handover.guide',
            'icon' => 'book-open',
            'permissions' => $handoverGuidePermissions,
        ],
        [
            'title' => 'PC Handover',
            'slug' => 'pc-handover',
            'icon' => 'rotate-ccw',
            'permissions' => ['stage1.signoff', 'old-pc.submit', 'pc.manage', 'stage.manage-all', 'pc.view', 'pc.view-dept', 'pc.view-own'],
            'children' => [
                [
                    'title' => 'View',
                    'route' => 'pc-handover.index',
                    'icon' => 'eye',
                    'match' => 'exact',
                    'permissions' => ['stage1.signoff', 'old-pc.submit', 'pc.manage', 'stage.manage-all', 'pc.view', 'pc.view-dept', 'pc.view-own'],
                ],
                [
                    'title' => 'Add',
                    'route' => 'pc-handover.create',
                    'icon' => 'plus',
                    'match' => 'exact',
                    'permissions' => ['stage1.signoff', 'old-pc.submit', 'pc.manage', 'stage.manage-all'],
                ],
                [
                    'title' => 'Edit',
                    'route' => 'pc-handover.index',
                    'icon' => 'pencil',
                    'match' => 'edit',
                    'permissions' => ['stage1.signoff', 'old-pc.submit', 'pc.manage', 'stage.manage-all'],
                ],
            ],
        ],
        [
            'title' => 'Summary',
            'route' => 'summary.index',
            'icon' => 'bar-chart-3',
            'permissions' => ['reports.all', 'reports.dept', 'stage.manage-all', 'pc.manage'],
        ],
        [
            'title' => 'Insights & Analytics',
            'route' => 'insights.index',
            'icon' => 'line-chart',
            'roles' => ['super_admin', 'director'],
        ],
        [
            'title' => 'Lookups',
            'slug' => 'lookups',
            'icon' => 'search',
            'permissions' => ['config.manage'],
            'children' => $lookupChildren,
        ],
        [
            'title' => 'Users',
            'slug' => 'users',
            'icon' => 'users',
            'permissions' => ['users.manage'],
            'children' => $usersChildren,
        ],
    ],

    'footer' => [],
];
