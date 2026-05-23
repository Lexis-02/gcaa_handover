<?php

$crudChildren = static fn (string $slug): array => [
    ['title' => 'Add', 'action' => 'add', 'icon' => 'plus'],
    ['title' => 'View', 'action' => 'view', 'icon' => 'eye'],
    ['title' => 'Edit', 'action' => 'edit', 'icon' => 'pencil'],
];

return [

    'main' => [
        [
            'title' => 'Dashboard',
            'route' => 'dashboard',
            'icon' => 'layout-grid',
            'roles' => ['*'],
        ],
        [
            'title' => 'Register',
            'slug' => 'register',
            'icon' => 'clipboard-plus',
            'roles' => ['*'],
            'children' => $crudChildren('register'),
        ],
        [
            'title' => 'Old PC Returns',
            'slug' => 'old-pc-returns',
            'icon' => 'rotate-ccw',
            'roles' => ['*'],
            'children' => $crudChildren('old-pc-returns'),
        ],
        [
            'title' => 'Summary or report',
            'slug' => 'summary-report',
            'icon' => 'bar-chart-3',
            'roles' => ['*'],
            'children' => $crudChildren('summary-report'),
        ],
        [
            'title' => 'Lookups',
            'slug' => 'lookups',
            'icon' => 'search',
            'roles' => ['*'],
            'children' => $crudChildren('lookups'),
        ],
        [
            'title' => 'Users',
            'slug' => 'users',
            'icon' => 'users',
            'permissions' => ['users.manage'],
            'children' => $crudChildren('users'),
        ],
    ],

    'footer' => [],
];
