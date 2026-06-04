<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'pc_asset_id',
    'staff_id',
    'old_asset_tag',
    'old_make_model',
    'old_serial_no',
    'old_hostname',
    'year_of_purchase',
    'condition',
    'reason_for_replacement',
    'data_wiped',
    'data_wiped_by',
    'data_wiped_at',
    'returned_at',
    'return_action',
    'given_to_fullname',
    'given_to_staff_number',
    'given_to_designation',
    'given_to_department_id',
    'given_to_telephone',
    'acc_power_adapter',
    'acc_carrying_bag',
    'acc_hdmi_vga',
    'acc_mouse',
    'acc_docking_station',
    'acc_headset',
    'acc_keyboard',
    'acc_monitor',
    'acc_other',
    'dbw_user_backed_up',
    'dbw_ict_wiped',
    'dbw_data_transferred',
    'dbw_no_wipe_required',
    'remarks',
])]
class OldPcReturn extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'data_wiped_at' => 'datetime',
            'returned_at' => 'datetime',
            'year_of_purchase' => 'integer',
            'acc_power_adapter' => 'boolean',
            'acc_carrying_bag' => 'boolean',
            'acc_hdmi_vga' => 'boolean',
            'acc_mouse' => 'boolean',
            'acc_docking_station' => 'boolean',
            'acc_headset' => 'boolean',
            'acc_keyboard' => 'boolean',
            'acc_monitor' => 'boolean',
            'dbw_user_backed_up' => 'boolean',
            'dbw_ict_wiped' => 'boolean',
            'dbw_data_transferred' => 'boolean',
            'dbw_no_wipe_required' => 'boolean',
        ];
    }

    public static function isAffirmative(?string $value): bool
    {
        return $value === 'Yes';
    }

    public function isFullyReturned(): bool
    {
        return ($this->dbw_ict_wiped || $this->dbw_no_wipe_required || self::isAffirmative($this->data_wiped))
            && in_array($this->return_action, ['return_to_stores', 'given_to_user'], true);
    }

    protected static function booted()
    {
        static::saved(function ($oldPcReturn) {
            $pcAsset = $oldPcReturn->pcAsset;
            if ($pcAsset) {
                $pcAsset->status = $pcAsset->computeStatus();
                $pcAsset->save();
            }
        });

        static::deleted(function ($oldPcReturn) {
            $pcAsset = $oldPcReturn->pcAsset;
            if ($pcAsset) {
                $pcAsset->status = $pcAsset->computeStatus();
                $pcAsset->save();
            }
        });
    }

    public function pcAsset(): BelongsTo
    {
        return $this->belongsTo(PcAsset::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function givenToDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'given_to_department_id');
    }
}
