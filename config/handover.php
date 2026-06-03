<?php

return [

    'conditions_on_issue' => [
        'Sealed/New',
        'Inspected & Working',
        'Minor Defect',
        'Faulty on Arrival',
    ],

    'os_options' => [
        'Windows 11 Pro',
        'Windows 10 Pro',
        'Windows 11 Enterprise',
    ],

    'status_labels' => [
        'pending' => 'Pending',
        'stage_1_complete' => 'Stage 1 complete',
        'stage_2_complete' => 'Stage 2 complete',
        'stage_3_complete' => 'Stage 3 complete',
        'complete' => 'Complete',
        'faulty_on_arrival' => 'Faulty on arrival',
        'on_hold' => 'On hold',
    ],

    /*
    |--------------------------------------------------------------------------
    | Handover stages (who signs before status becomes Complete)
    |--------------------------------------------------------------------------
    |
    | Stage 1 — Stores Officer (stage1.signoff): Form 1 / picked from stores
    | Stage 2 — Department Director (stage2.signoff): Form 2 / received by director
    | Stage 3 — Assigned end user (stage3.signoff): Form 3 / issued to end user
    | Complete — All three forms signed AND old PC returned to stores
    |
    */
    'stages' => [
        1 => [
            'key' => 'stage_1',
            'label' => 'Stage 1',
            'description' => 'Picked from Stores',
            'form_label' => 'Form 1 signed',
            'signer_role' => 'Stores Officer',
            'permission' => 'stage1.signoff',
        ],
        2 => [
            'key' => 'stage_2',
            'label' => 'Stage 2',
            'description' => 'Received by Director',
            'form_label' => 'Form 2 signed',
            'signer_role' => 'Director (receiving department)',
            'permission' => 'stage2.signoff',
        ],
        3 => [
            'key' => 'stage_3',
            'label' => 'Stage 3',
            'description' => 'Issued to End-User',
            'form_label' => 'Form 3 signed',
            'signer_role' => 'Assigned end user',
            'permission' => 'stage3.signoff',
        ],
        'complete' => [
            'key' => 'complete',
            'label' => 'Complete',
            'description' => 'All stages signed off',
            'form_label' => 'Form 3 + old PC returned/reassigned',
            'signer_role' => null,
            'permission' => null,
        ],
    ],
];
