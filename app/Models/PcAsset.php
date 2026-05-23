<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Scopes\DepartmentScope;

#[Fillable([
    'batch_id',
    'ref_no',
    'asset_tag',
    'make_model',
    'serial_number',
    'hostname',
    'os',
    'condition_on_issue',
    'status',
    'assigned_staff_id',
    'department_id',
    'building_id',
    'room_ext'
])]
class PcAsset extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::addGlobalScope(new DepartmentScope);
    }

    public function computeStatus(): string
    {
        if ($this->condition_on_issue === 'Faulty on Arrival') {
            return 'faulty_on_arrival';
        }

        $stages = $this->handoverStages->pluck('stage')->toArray();
        $oldReturn = $this->oldPcReturn;

        $hasStage1 = in_array(1, $stages);
        $hasStage2 = in_array(2, $stages);
        $hasStage3 = in_array(3, $stages);
        
        $oldPcReturned = $oldReturn?->isFullyReturned() ?? false;

        if ($hasStage1 && $hasStage2 && $hasStage3 && $oldPcReturned) {
            return 'complete';
        }
        
        if ($hasStage1 && $hasStage2 && $hasStage3) {
            return 'stage_3_complete';
        }
        
        if ($hasStage1 && $hasStage2) {
            return 'stage_2_complete';
        }
        
        if ($hasStage1) {
            return 'stage_1_complete';
        }

        return 'pending';
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    public function handoverStages(): HasMany
    {
        return $this->hasMany(HandoverStage::class);
    }

    public function oldPcReturn(): HasOne
    {
        return $this->hasOne(OldPcReturn::class);
    }

    public function generatedForms(): HasMany
    {
        return $this->hasMany(GeneratedForm::class);
    }

    public function assignedStaff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'assigned_staff_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }
}
