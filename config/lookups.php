<?php

return [

    'value_types' => [
        'pc_condition' => [
            'title' => 'PC Condition',
            'slug' => 'pc-conditions',
        ],
        'old_pc_condition' => [
            'title' => 'Old PC Condition',
            'slug' => 'old-pc-conditions',
        ],
        'yes_no' => [
            'title' => 'Yes / No',
            'slug' => 'yes-no',
        ],
        'os' => [
            'title' => 'Operating System',
            'slug' => 'operating-systems',
        ],
    ],

    'fallbacks' => [
        'pc_condition' => [
            'Sealed/New',
            'Inspected & Working',
            'Minor Defect',
            'Faulty on Arrival',
        ],
        'old_pc_condition' => [
            'Working',
            'Partially Working',
            'Faulty',
            'Beyond Repair',
        ],
        'yes_no' => [
            'Yes',
            'No',
            'N/A',
        ],
        'os' => [
            'Windows 10 Pro',
            'Windows 11 Pro',
            'macOS',
            'Ubuntu Linux',
        ],
    ],
];
