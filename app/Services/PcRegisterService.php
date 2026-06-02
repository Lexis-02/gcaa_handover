<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Batch;
use App\Models\PcAsset;
use App\Models\Scopes\DepartmentScope;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PcRegisterService
{
    public function __construct(
        private readonly LookupService $lookups,
    ) {}

    public function paginatedRegister(
        ?string $search = null,
        ?string $statusGroup = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        $query = PcAsset::query()
            ->with([
                'batch:id,batch_code,year',
                'department:id,name,code',
                'building:id,name',
                'assignedStaff:id,full_name,staff_number,designation',
                'handoverStages:id,pc_asset_id,stage,actioned_at',
                'oldPcReturn:id,pc_asset_id,returned_to_stores,data_wiped',
            ]);

        $term = $search !== null ? trim($search) : '';

        if ($term !== '') {
            $like = '%'.$term.'%';
            $query->where(function ($builder) use ($like) {
                $builder
                    ->where('ref_no', 'like', $like)
                    ->orWhere('asset_tag', 'like', $like)
                    ->orWhere('make_model', 'like', $like)
                    ->orWhere('serial_number', 'like', $like)
                    ->orWhere('hostname', 'like', $like)
                    ->orWhere('os', 'like', $like)
                    ->orWhere('condition_on_issue', 'like', $like)
                    ->orWhereHas('department', fn ($q) => $q->where('name', 'like', $like))
                    ->orWhereHas('building', fn ($q) => $q->where('name', 'like', $like))
                    ->orWhere('assigned_user_name', 'like', $like)
                    ->orWhereHas('assignedStaff', fn ($q) => $q->where('full_name', 'like', $like)
                        ->orWhere('staff_number', 'like', $like));
            });
        }

        $group = $statusGroup !== null ? trim($statusGroup) : '';

        if ($group === 'pending') {
            $query->where('status', 'pending');
        } elseif ($group === 'sign-off') {
            $query->whereIn('status', [
                'stage_1_complete',
                'stage_2_complete',
                'stage_3_complete',
            ]);
        } elseif ($group === 'complete') {
            $query->where('status', 'complete');
        }

        return $query
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function handoverLegend(): array
    {
        return array_values(config('handover.stages', []));
    }

    /**
     * @return array<string, mixed>
     */
    public function stageProgress(PcAsset $asset): array
    {
        $stages = $asset->handoverStages->keyBy('stage');
        $oldReturned = (bool) $asset->oldPcReturn?->isFullyReturned();

        return [
            'stage_1' => $stages->has(1),
            'stage_2' => $stages->has(2),
            'stage_3' => $stages->has(3),
            'old_pc_returned' => $oldReturned,
            'complete' => $stages->has(1) && $stages->has(2) && $stages->has(3) && $oldReturned,
        ];
    }

    public function nextSignerLabel(PcAsset $asset): ?string
    {
        if ($asset->status === 'faulty_on_arrival' || $asset->status === 'on_hold') {
            return null;
        }

        $progress = $this->stageProgress($asset);

        if (! $progress['stage_1']) {
            return (string) config('handover.stages.1.signer_role');
        }

        if (! $progress['stage_2']) {
            return (string) config('handover.stages.2.signer_role');
        }

        if (! $progress['stage_3']) {
            $name = $asset->assigned_user_name ?? $asset->assignedStaff?->full_name;

            return $name
                ? 'Assigned end user ('.$name.')'
                : (string) config('handover.stages.3.signer_role');
        }

        if (! $progress['old_pc_returned']) {
            return 'End user (old PC return to stores)';
        }

        return null;
    }

    public function generateRefNo(Batch $batch): string
    {
        $count = PcAsset::query()
            ->withoutGlobalScope(DepartmentScope::class)
            ->where('batch_id', $batch->id)
            ->count();

        $sequence = (int) $batch->serial_from + $count;
        $padding = max(3, strlen((string) $batch->serial_to));

        return sprintf(
            'GCAA-PC-%d-%s',
            $batch->year,
            str_pad((string) $sequence, $padding, '0', STR_PAD_LEFT)
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForList(PcAsset $asset): array
    {
        $stages = $asset->handoverStages->keyBy('stage');

        return [
            'id' => $asset->id,
            'ref_no' => $asset->ref_no,
            'asset_tag' => $asset->asset_tag,
            'make_model' => $asset->make_model,
            'serial_number' => $asset->serial_number,
            'hostname' => $asset->hostname,
            'os' => $asset->os,
            'condition_on_issue' => $asset->condition_on_issue,
            'status' => $asset->status,
            'room_ext' => $asset->room_ext,
            'batch' => $asset->batch?->only(['id', 'batch_code', 'year']),
            'department' => $asset->department?->only(['id', 'name', 'code']),
            'building' => $asset->building?->only(['id', 'name']),
            'assignee' => $asset->assigned_user_name ? [
                'full_name' => $asset->assigned_user_name,
                'staff_number' => null,
                'designation' => null,
            ] : ($asset->assignedStaff ? [
                'full_name' => $asset->assignedStaff->full_name,
                'staff_number' => $asset->assignedStaff->staff_number,
                'designation' => $asset->assignedStaff->designation,
            ] : null),
            'stores_issue_date' => $stages->get(1)?->actioned_at?->format('Y-m-d'),
            'form_1_signed' => $stages->has(1),
            'director_receipt_date' => $stages->get(2)?->actioned_at?->format('Y-m-d'),
            'form_2_signed' => $stages->has(2),
            'end_user_receipt_date' => $stages->get(3)?->actioned_at?->format('Y-m-d'),
            'form_3_signed' => $stages->has(3),
            'old_pc_returned' => (bool) $asset->oldPcReturn?->isFullyReturned(),
            'old_pc_return_id' => $asset->oldPcReturn?->id,
            'can_edit' => true,
            'stage_progress' => $this->stageProgress($asset),
            'next_signer' => $this->nextSignerLabel($asset),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formOptions(): array
    {
        return [
            'batches' => Batch::query()->orderByDesc('year')->get(['id', 'batch_code', 'year', 'total_pcs']),
            'departments' => \App\Models\Department::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'buildings' => \App\Models\Building::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'conditions' => $this->lookups->pcConditions(),
            'os_options' => $this->lookups->osOptions(),
        ];
    }
}
