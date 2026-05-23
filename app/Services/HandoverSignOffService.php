<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\HandoverStage;
use App\Models\PcAsset;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class HandoverSignOffService
{
    public function pendingStageFor(PcAsset $asset): ?int
    {
        if (in_array($asset->status, ['faulty_on_arrival', 'on_hold', 'complete'], true)) {
            return null;
        }

        $stages = $asset->relationLoaded('handoverStages')
            ? $asset->handoverStages->pluck('stage')->all()
            : $asset->handoverStages()->pluck('stage')->all();

        if (! in_array(1, $stages, true)) {
            return 1;
        }

        if (! in_array(2, $stages, true)) {
            return 2;
        }

        if (! in_array(3, $stages, true)) {
            return 3;
        }

        return null;
    }

    public function canUserSignOff(User $user, PcAsset $asset): ?int
    {
        $pendingStage = $this->pendingStageFor($asset);

        if ($pendingStage === null) {
            return null;
        }

        return match ($pendingStage) {
            1 => $user->can('stage1.signoff') ? 1 : null,
            2 => $this->directorMaySignStage2($user, $asset) ? 2 : null,
            3 => $this->endUserMaySignStage3($user, $asset) ? 3 : null,
            default => null,
        };
    }

    /**
     * @return array{stage: int, title: string, description: string, form_ref: string}|null
     */
    public function signOffActionFor(User $user, PcAsset $asset): ?array
    {
        $stage = $this->canUserSignOff($user, $asset);

        if ($stage === null) {
            return null;
        }

        $config = config("handover.stages.{$stage}");

        return [
            'stage' => $stage,
            'title' => 'Sign off — '.$config['label'],
            'description' => $config['description'],
            'form_ref' => sprintf('ICT/PC-HO/%02d', $stage),
        ];
    }

    /**
     * Read-only handover status for register overseers (e.g. ICT admin) who cannot sign.
     *
     * @return array{stage: int, stage_label: string, stage_description: string, form_ref: string}|null
     */
    public function oversightFor(User $user, PcAsset $asset): ?array
    {
        if (! $user->can('stage.manage-all')) {
            return null;
        }

        $pendingStage = $this->pendingStageFor($asset);

        if ($pendingStage === null || $this->canUserSignOff($user, $asset) !== null) {
            return null;
        }

        $config = config("handover.stages.{$pendingStage}");

        return [
            'stage' => $pendingStage,
            'stage_label' => $config['label'],
            'stage_description' => $config['description'],
            'form_ref' => sprintf('ICT/PC-HO/%02d', $pendingStage),
        ];
    }

    public function userMaySignAnyStage(User $user): bool
    {
        return $user->can('stage1.signoff')
            || $user->can('stage2.signoff')
            || $user->can('stage3.signoff');
    }

    public function recordSignOff(User $user, PcAsset $asset, ?string $notes = null): HandoverStage
    {
        $stage = $this->canUserSignOff($user, $asset);

        abort_unless($stage !== null, 403);

        if ($asset->handoverStages()->where('stage', $stage)->exists()) {
            abort(409, 'This stage has already been signed off.');
        }

        return HandoverStage::query()->create([
            'pc_asset_id' => $asset->id,
            'stage' => $stage,
            'actioned_by' => $user->id,
            'actioned_at' => now(),
            'form_ref' => sprintf('ICT/PC-HO/%02d', $stage),
            'notes' => $notes,
            'ip_address' => (string) request()->ip(),
        ]);
    }

    public function signOffQueue(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->actionableQueueQuery($user)
            ->with([
                'department:id,name',
                'building:id,name',
                'assignedStaff:id,full_name',
                'handoverStages:id,pc_asset_id,stage,actioned_by',
            ])
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function queueCountFor(User $user): int
    {
        return $this->actionableQueueQuery($user)->count();
    }

    /**
     * PCs that still need a sign-off from this user (excludes PCs they already signed).
     */
    private function actionableQueueQuery(User $user): Builder
    {
        $query = PcAsset::query();

        if ($user->can('stage.manage-all') && $this->userMaySignAnyStage($user)) {
            return $this->manageAllActionableQuery($query, $user);
        }

        if ($user->can('stage1.signoff')) {
            return $query->where('status', 'pending');
        }

        if ($user->can('stage2.signoff')) {
            return $query
                ->where('status', 'stage_1_complete')
                ->where('department_id', $user->department_id)
                ->whereDoesntHave('handoverStages', fn (Builder $q) => $q
                    ->where('stage', 2)
                    ->where('actioned_by', $user->id));
        }

        if ($user->can('stage3.signoff')) {
            return $query
                ->where('status', 'stage_2_complete')
                ->where('assigned_staff_id', $user->staff_id)
                ->whereDoesntHave('handoverStages', fn (Builder $q) => $q
                    ->where('stage', 3)
                    ->where('actioned_by', $user->id));
        }

        return $query->whereRaw('0 = 1');
    }

    private function manageAllActionableQuery(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $outer) use ($user) {
            $outer
                ->where(function (Builder $q) use ($user) {
                    $q->where('status', 'pending')
                        ->whereDoesntHave('handoverStages', fn (Builder $s) => $s
                            ->where('stage', 1)
                            ->where('actioned_by', $user->id));
                })
                ->orWhere(function (Builder $q) use ($user) {
                    $q->where('status', 'stage_1_complete')
                        ->whereDoesntHave('handoverStages', fn (Builder $s) => $s
                            ->where('stage', 2)
                            ->where('actioned_by', $user->id));
                })
                ->orWhere(function (Builder $q) use ($user) {
                    $q->where('status', 'stage_2_complete')
                        ->whereDoesntHave('handoverStages', fn (Builder $s) => $s
                            ->where('stage', 3)
                            ->where('actioned_by', $user->id));
                });
        });
    }

    private function directorMaySignStage2(User $user, PcAsset $asset): bool
    {
        if (! $user->can('stage2.signoff')) {
            return false;
        }

        return $user->department_id !== null
            && (int) $user->department_id === (int) $asset->department_id;
    }

    private function endUserMaySignStage3(User $user, PcAsset $asset): bool
    {
        if (! $user->can('stage3.signoff')) {
            return false;
        }

        return $user->staff_id !== null
            && (int) $user->staff_id === (int) $asset->assigned_staff_id;
    }
}
