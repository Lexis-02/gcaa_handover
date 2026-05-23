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

        if ($user->can('stage.manage-all')) {
            return $pendingStage;
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
        return $this->queueQuery($user)
            ->with([
                'department:id,name',
                'building:id,name',
                'assignedStaff:id,full_name',
                'handoverStages:id,pc_asset_id,stage',
            ])
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function queueCountFor(User $user): int
    {
        return $this->queueQuery($user)->count();
    }

    private function queueQuery(User $user): Builder
    {
        $query = PcAsset::query();

        if ($user->can('stage.manage-all')) {
            return $query->whereIn('status', [
                'pending',
                'stage_1_complete',
                'stage_2_complete',
            ]);
        }

        if ($user->can('stage1.signoff')) {
            return $query->where('status', 'pending');
        }

        if ($user->can('stage2.signoff')) {
            return $query
                ->where('status', 'stage_1_complete')
                ->where('department_id', $user->department_id);
        }

        if ($user->can('stage3.signoff')) {
            return $query
                ->where('status', 'stage_2_complete')
                ->where('assigned_staff_id', $user->staff_id);
        }

        return $query->whereRaw('0 = 1');
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
