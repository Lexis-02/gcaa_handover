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
            'return_action' => $old?->return_action,
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
            ->orderBy('ref_no')
            ->get(['id', 'ref_no', 'serial_number', 'make_model', 'assigned_staff_id', 'assigned_user_name', 'department_id']);
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
                'end_user' => $asset->assigned_user_name ?: $asset->assignedStaff?->full_name,
                'department' => $asset->department?->name,
            ])->values()->all(),
            'old_pc_conditions' => $this->lookups->oldPcConditions(),
            'yes_no_options' => $this->lookups->yesNoOptions(),
            'return_actions' => [
                ['value' => 'return_to_stores', 'label' => 'Returned to ICT'],
                ['value' => 'given_to_user', 'label' => 'Given to another user'],
            ],
            'departments' => \App\Models\Department::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->toArray(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForForm(OldPcReturn $return): array
    {
        $return->loadMissing(['pcAsset.assignedStaff', 'pcAsset.department', 'givenToDepartment']);

        return [
            'id' => $return->id,
            'pc_asset_id' => $return->pc_asset_id,
            'ref_no' => $return->pcAsset?->ref_no,
            'end_user_name' => $return->pcAsset?->assigned_user_name ?? $return->pcAsset?->assignedStaff?->full_name,
            'department_name' => $return->pcAsset?->department?->name,
            'old_asset_tag' => $return->old_asset_tag,
            'old_make_model' => $return->old_make_model,
            'old_serial_no' => $return->old_serial_no,
            'old_hostname' => $return->old_hostname,
            'year_of_purchase' => $return->year_of_purchase,
            'condition' => $return->condition,
            'reason_for_replacement' => $return->reason_for_replacement,
            'data_wiped' => $return->data_wiped,
            'return_action' => $return->return_action,
            'given_to_fullname' => $return->given_to_fullname,
            'given_to_staff_number' => $return->given_to_staff_number,
            'given_to_designation' => $return->given_to_designation,
            'given_to_department_id' => $return->given_to_department_id,
            'given_to_telephone' => $return->given_to_telephone,
            'given_to_department_name' => $return->givenToDepartment?->name,
            'acc_power_adapter' => $return->acc_power_adapter,
            'acc_carrying_bag' => $return->acc_carrying_bag,
            'acc_hdmi_vga' => $return->acc_hdmi_vga,
            'acc_mouse' => $return->acc_mouse,
            'acc_docking_station' => $return->acc_docking_station,
            'acc_headset' => $return->acc_headset,
            'acc_keyboard' => $return->acc_keyboard,
            'acc_monitor' => $return->acc_monitor,
            'acc_other' => $return->acc_other,
            'dbw_user_backed_up' => $return->dbw_user_backed_up,
            'dbw_ict_wiped' => $return->dbw_ict_wiped,
            'dbw_data_transferred' => $return->dbw_data_transferred,
            'dbw_no_wipe_required' => $return->dbw_no_wipe_required,
            'remarks' => $return->remarks,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForShow(OldPcReturn $return): array
    {
        $base = $this->serializeForForm($return);

        return array_merge($base, [
            'created_at' => $return->created_at?->format('Y-m-d H:i'),
            'updated_at' => $return->updated_at?->format('Y-m-d H:i'),
            'return_action_label' => match ($return->return_action) {
                'return_to_stores' => 'Returned to ICT',
                'given_to_user' => 'Given to another user',
                default => $return->return_action,
            },
        ]);
    }
}
