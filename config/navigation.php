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
            'title' => 'Summary or report',
            'slug' => 'summary-report',
            'icon' => 'bar-chart-3',
            'permissions' => ['reports.all', 'reports.dept'],
            'children' => [
                ['title' => 'View', 'action' => 'view', 'icon' => 'eye'],
                ['title' => 'Add', 'action' => 'add', 'icon' => 'plus'],
                ['title' => 'Edit', 'action' => 'edit', 'icon' => 'pencil'],
            ],
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
