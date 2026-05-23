<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\OldPcReturn;
use App\Models\PcAsset;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PcHandoverService
{
    public function __construct(
        private readonly LookupService $lookups,
    ) {}

    public function paginatedHandover(
        ?string $search = null,
        ?string $statusGroup = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        $query = PcAsset::query()
            ->with([
                'department:id,name,code',
                'assignedStaff:id,full_name,staff_number',
                'oldPcReturn',
            ]);

        $group = $statusGroup !== null ? trim($statusGroup) : '';

        if ($group === 'recorded') {
            $query->whereHas('oldPcReturn');
        } elseif ($group === 'pending') {
            $query->whereDoesntHave('oldPcReturn');
        }

        $term = $search !== null ? trim($search) : '';

        if ($term !== '') {
            $like = '%'.$term.'%';
            $query->where(function ($builder) use ($like) {
                $builder
                    ->where('ref_no', 'like', $like)
                    ->orWhere('serial_number', 'like', $like)
                    ->orWhere('make_model', 'like', $like)
                    ->orWhereHas('department', fn ($q) => $q->where('name', 'like', $like))
                    ->orWhereHas('assignedStaff', fn ($q) => $q->where('full_name', 'like', $like))
                    ->orWhereHas('oldPcReturn', function ($q) use ($like) {
                        $q->where('old_asset_tag', 'like', $like)
                            ->orWhere('old_make_model', 'like', $like)
                            ->orWhere('old_serial_no', 'like', $like)
                            ->orWhere('condition', 'like', $like)
                            ->orWhere('reason_for_replacement', 'like', $like);
                    });
            });
        }

        return $query
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeRow(PcAsset $asset, int $rowNumber): array
    {
        $old = $asset->oldPcReturn;

        return [
            'row_number' => $rowNumber,
            'id' => $asset->id,
            'old_pc_return_id' => $old?->id,
            'ref_no' => $asset->ref_no,
            'new_serial_number' => $asset->serial_number,
            'new_make_model' => $asset->make_model,
            'end_user_name' => $asset->assignedStaff?->full_name,
            'department' => $asset->department?->only(['id', 'name', 'code']),
            'old_pc_summary' => $old
                ? trim($old->old_make_model.' · '.$old->old_serial_no)
                : null,
            'old_pc_condition' => $old?->condition,
            'data_wiped' => $old?->data_wiped,
            'returned_to_stores' => $old?->returned_to_stores,
            'has_old_pc_return' => $old !== null,
            'can_edit' => $old !== null,
        ];
    }

    /**
     * @return Collection<int, PcAsset>
     */
    public function pcsEligibleForOldReturn(): Collection
    {
        return PcAsset::query()
            ->with(['assignedStaff:id,full_name,staff_number', 'department:id,name'])
            ->whereDoesntHave('oldPcReturn')
            ->whereHas('assignedStaff')
            ->orderBy('ref_no')
            ->get(['id', 'ref_no', 'serial_number', 'make_model', 'assigned_staff_id', 'department_id']);
    }

    /**
     * @return array<string, mixed>
     */
    public function formOptions(): array
    {
        return [
            'pcs' => $this->pcsEligibleForOldReturn()->map(fn (PcAsset $asset) => [
                'id' => $asset->id,
                'ref_no' => $asset->ref_no,
                'serial_number' => $asset->serial_number,
                'make_model' => $asset->make_model,
                'end_user' => $asset->assignedStaff?->full_name,
                'department' => $asset->department?->name,
            ])->values()->all(),
            'old_pc_conditions' => $this->lookups->oldPcConditions(),
            'yes_no_options' => $this->lookups->yesNoOptions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForForm(OldPcReturn $return): array
    {
        $return->loadMissing(['pcAsset.assignedStaff', 'pcAsset.department']);

        return [
            'id' => $return->id,
            'pc_asset_id' => $return->pc_asset_id,
            'ref_no' => $return->pcAsset?->ref_no,
            'end_user_name' => $return->pcAsset?->assignedStaff?->full_name,
            'department_name' => $return->pcAsset?->department?->name,
            'old_asset_tag' => $return->old_asset_tag,
            'old_make_model' => $return->old_make_model,
            'old_serial_no' => $return->old_serial_no,
            'year_of_purchase' => $return->year_of_purchase,
            'condition' => $return->condition,
            'reason_for_replacement' => $return->reason_for_replacement,
            'data_wiped' => $return->data_wiped,
            'returned_to_stores' => $return->returned_to_stores,
        ];
    }
}
