<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePcRegisterRequest;
use App\Http\Requests\UpdatePcRegisterRequest;
use App\Models\Batch;
use App\Models\PcAsset;
use App\Services\HandoverSignOffService;
use App\Services\PcRegisterService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PcRegisterController extends Controller
{
    public function __construct(
        private readonly PcRegisterService $register,
        private readonly HandoverSignOffService $signOff,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('pc.view')
            || $request->user()?->can('pc.view-dept')
            || $request->user()?->can('pc.view-own')
            || $request->user()?->can('stage.manage-all'), 403);

        $search = $request->string('q')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $allowedStatus = ['pending', 'sign-off', 'complete'];
        $statusGroup = in_array($status, $allowedStatus, true) ? $status : null;

        $paginator = $this->register->paginatedRegister(
            $search !== '' ? $search : null,
            $statusGroup,
        );

        $user = $request->user();

        return Inertia::render('pc-register/index', [
            'records' => $paginator->through(function (PcAsset $asset) use ($user) {
                return [
                    ...$this->register->serializeForList($asset),
                    'can_delete' => $this->userCanDelete($user, $asset),
                ];
            }),
            'filters' => [
                'q' => $search,
                'status' => $statusGroup ?? '',
            ],
            'meta' => [
                'can_create' => $user->can('pc.manage'),
                'can_edit' => $user->can('pc.manage'),
            ],
            'status_labels' => config('handover.status_labels', []),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('pc.manage'), 403);

        return Inertia::render('pc-register/create', [
            'options' => $this->register->formOptions(),
        ]);
    }

    public function store(StorePcRegisterRequest $request): RedirectResponse
    {
        $batch = Batch::query()->findOrFail($request->validated('batch_id'));

        $status = $request->validated('condition_on_issue') === 'Faulty on Arrival'
            ? 'faulty_on_arrival'
            : 'pending';

        PcAsset::query()->create([
            ...$request->validated(),
            'ref_no' => $this->register->generateRefNo($batch),
            'status' => $status,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'PC record added to the handover register.',
        ]);

        return redirect()->route('pc-register.index');
    }

    public function show(Request $request, PcAsset $pc_register): Response
    {
        abort_unless($request->user()?->can('pc.view')
            || $request->user()?->can('pc.view-dept')
            || $request->user()?->can('pc.view-own')
            || $request->user()?->can('stage.manage-all'), 403);

        $pc_register->load([
            'batch',
            'department',
            'building',
            'assignedStaff',
            'handoverStages',
            'oldPcReturn',
        ]);

        $user = $request->user();

        return Inertia::render('pc-register/show', [
            'record' => $this->register->serializeForList($pc_register),
            'meta' => [
                'can_edit' => $user->can('pc.manage') && $pc_register->status === 'pending',
                'can_delete' => $this->userCanDelete($user, $pc_register),
                'sign_off' => $this->signOff->signOffActionFor($user, $pc_register),
            ],
            'status_labels' => config('handover.status_labels', []),
        ]);
    }

    public function destroy(Request $request, PcAsset $pc_register): RedirectResponse
    {
        abort_unless($this->userCanDelete($request->user(), $pc_register), 403);

        $ref = $pc_register->ref_no;
        $pc_register->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "PC record {$ref} removed from the register.",
        ]);

        return redirect()->route('pc-register.index');
    }

    private function userCanDelete(\App\Models\User $user, PcAsset $asset): bool
    {
        if (! $user->can('pc.manage')) {
            return false;
        }

        if ($asset->status !== 'pending') {
            return false;
        }

        return $asset->handoverStages()->doesntExist();
    }

    public function edit(Request $request, PcAsset $pc_register): Response|RedirectResponse
    {
        abort_unless($request->user()?->can('pc.manage'), 403);

        if ($pc_register->status !== 'pending') {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'Only pending PCs can be edited. Stage sign-offs are locked.',
            ]);

            return redirect()->route('pc-register.show', $pc_register);
        }

        $pc_register->load(['batch:id,batch_code,year']);

        return Inertia::render('pc-register/edit', [
            'record' => $pc_register->only([
                'id', 'ref_no', 'batch_id', 'asset_tag', 'make_model', 'serial_number',
                'hostname', 'os', 'condition_on_issue', 'assigned_staff_id',
                'department_id', 'building_id', 'room_ext',
            ]),
            'options' => $this->register->formOptions(),
        ]);
    }

    public function update(UpdatePcRegisterRequest $request, PcAsset $pc_register): RedirectResponse
    {
        if ($pc_register->status !== 'pending') {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'Only pending PCs can be edited.',
            ]);

            return redirect()->route('pc-register.show', $pc_register);
        }

        $pc_register->update($request->validated());

        if ($request->validated('condition_on_issue') === 'Faulty on Arrival') {
            $pc_register->update(['status' => 'faulty_on_arrival']);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Register record updated.',
        ]);

        return redirect()->route('pc-register.show', $pc_register);
    }
}
