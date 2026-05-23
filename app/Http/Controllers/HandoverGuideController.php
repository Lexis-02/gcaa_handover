<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\PcRegisterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HandoverGuideController extends Controller
{
    public function __construct(
        private readonly PcRegisterService $register,
    ) {}

    public function show(Request $request): Response
    {
        abort_unless($request->user(), 403);

        $user = $request->user();

        return Inertia::render('handover/guide', [
            'stages' => $this->register->handoverLegend(),
            'can_access_sign_offs' => $user->can('stage1.signoff')
                || $user->can('stage2.signoff')
                || $user->can('stage3.signoff')
                || $user->can('stage.manage-all'),
        ]);
    }
}
