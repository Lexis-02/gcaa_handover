<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\SignOffPcHandoverRequest;
use App\Models\PcAsset;
use App\Services\HandoverNotificationService;
use App\Services\HandoverSignOffService;
use App\Services\PcRegisterService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HandoverSignOffController extends Controller
{
    public function __construct(
        private readonly HandoverSignOffService $signOff,
        private readonly PcRegisterService $register,
        private readonly HandoverNotificationService $notifications,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($this->userMayAccessSignOffs($request), 403);

        $paginator = $this->signOff->signOffQueue($request->user());

        return Inertia::render('handover-sign-offs/index', [
            'records' => $paginator->through(function (PcAsset $asset) use ($request) {
                $data = $this->register->serializeForList($asset);
                $action = $this->signOff->signOffActionFor($request->user(), $asset);

                return [
                    ...$data,
                    'can_sign_off' => $action !== null,
                    'sign_off' => $action,
                ];
            }),
            'status_labels' => config('handover.status_labels', []),
            'stage_heading' => $this->queueHeadingFor($request->user()),
            'oversight_only' => $request->user()->can('stage.manage-all')
                && ! $this->signOff->userMaySignAnyStage($request->user()),
        ]);
    }

    public function store(SignOffPcHandoverRequest $request, PcAsset $pc_register): RedirectResponse
    {
        $this->signOff->recordSignOff(
            $request->user(),
            $pc_register,
            $request->validated('notes'),
        );

        $fresh = $pc_register->fresh(['handoverStages', 'assignedStaff', 'department', 'oldPcReturn']);
        $this->notifications->notifyPendingSigners($fresh);

        $stage = $this->signOff->pendingStageFor($fresh);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $stage === null
                ? 'Handover stage signed off successfully.'
                : 'Form signed. The handover moves to the next stage.',
        ]);

        $redirect = $request->string('redirect')->toString();

        return match ($redirect) {
            'register' => redirect()->route('pc-register.show', $pc_register),
            'queue' => redirect()->route('handover-sign-offs.index'),
            default => redirect()->route('handover-sign-offs.index'),
        };
    }

    private function userMayAccessSignOffs(Request $request): bool
    {
        $user = $request->user();

        return $user?->can('stage1.signoff')
            || $user?->can('stage2.signoff')
            || $user?->can('stage3.signoff')
            || $user?->can('stage.manage-all');
    }

    private function queueHeadingFor(\App\Models\User $user): string
    {
        if ($user->can('stage.manage-all') && ! $this->signOff->userMaySignAnyStage($user)) {
            return 'Handover sign-off queue (monitoring only — you do not sign forms)';
        }

        if ($user->can('stage.manage-all')) {
            return 'PCs awaiting any stage sign-off';
        }

        if ($user->can('stage1.signoff')) {
            return 'PCs awaiting Form 1 — picked from stores';
        }

        if ($user->can('stage2.signoff')) {
            return 'PCs awaiting Form 2 — director receipt (your department)';
        }

        return 'PCs awaiting Form 3 — issued to you';
    }
}
