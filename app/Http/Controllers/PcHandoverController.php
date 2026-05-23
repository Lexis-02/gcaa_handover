<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePcHandoverRequest;
use App\Http\Requests\UpdatePcHandoverRequest;
use App\Models\OldPcReturn;
use App\Models\PcAsset;
use App\Services\HandoverNotificationService;
use App\Services\PcHandoverService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PcHandoverController extends Controller
{
    public function __construct(
        private readonly PcHandoverService $handover,
        private readonly HandoverNotificationService $notifications,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($this->canView($request), 403);

        $search = $request->string('q')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $allowedStatus = ['recorded', 'pending'];
        $statusGroup = in_array($status, $allowedStatus, true) ? $status : null;

        $paginator = $this->handover->paginatedHandover(
            $search !== '' ? $search : null,
            $statusGroup,
        );
        $offset = ($paginator->currentPage() - 1) * $paginator->perPage();

        return Inertia::render('pc-handover/index', [
            'records' => $paginator->through(function (PcAsset $asset, int $key) use ($offset) {
                return $this->handover->serializeRow($asset, $offset + $key + 1);
            }),
            'filters' => [
                'q' => $search,
                'status' => $statusGroup ?? '',
            ],
            'meta' => [
                'can_create' => $this->canManage($request),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->canManage($request), 403);

        return Inertia::render('pc-handover/create', [
            'options' => $this->handover->formOptions(),
        ]);
    }

    public function store(StorePcHandoverRequest $request): RedirectResponse
    {
        $pc = PcAsset::query()->findOrFail($request->validated('pc_asset_id'));

        OldPcReturn::query()->create([
            ...$request->validated(),
            'staff_id' => $pc->assigned_staff_id,
        ]);

        $this->notifications->notifyPendingSigners(
            $pc->fresh(['handoverStages', 'assignedStaff', 'department', 'oldPcReturn']),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Old PC handover details recorded.',
        ]);

        return redirect()->route('pc-handover.index');
    }

    public function edit(Request $request, OldPcReturn $pc_handover): Response
    {
        abort_unless($this->canManage($request), 403);

        return Inertia::render('pc-handover/edit', [
            'record' => $this->handover->serializeForForm($pc_handover),
            'options' => [
                'old_pc_conditions' => $this->handover->formOptions()['old_pc_conditions'],
                'yes_no_options' => $this->handover->formOptions()['yes_no_options'],
            ],
        ]);
    }

    public function update(UpdatePcHandoverRequest $request, OldPcReturn $pc_handover): RedirectResponse
    {
        $pc_handover->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'PC handover record updated.',
        ]);

        return redirect()->route('pc-handover.index');
    }

    private function canView(Request $request): bool
    {
        $user = $request->user();

        return $user?->can('pc.view')
            || $user?->can('pc.view-dept')
            || $user?->can('pc.view-own')
            || $user?->can('old-pc.submit')
            || $user?->can('stage1.signoff')
            || $user?->can('pc.manage')
            || $user?->can('stage.manage-all');
    }

    private function canManage(Request $request): bool
    {
        $user = $request->user();

        return $user?->can('old-pc.submit')
            || $user?->can('stage1.signoff')
            || $user?->can('pc.manage')
            || $user?->can('stage.manage-all');
    }
}
