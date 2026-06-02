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
    'given_to_telephone'
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
        ];
    }

    public static function isAffirmative(?string $value): bool
    {
        return $value === 'Yes';
    }

    public function isFullyReturned(): bool
    {
        return self::isAffirmative($this->data_wiped)
            && $this->return_action === 'return_to_stores';
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
