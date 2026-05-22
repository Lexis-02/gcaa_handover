<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'pc_asset_id',
    'stage',
    'actioned_by',
    'actioned_at',
    'form_ref',
    'notes',
    'ip_address',
    'pdf_path'
])]
class HandoverStage extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'actioned_at' => 'datetime',
            'stage' => 'integer',
        ];
    }

    protected static function booted()
    {
        static::saved(function ($handoverStage) {
            $pcAsset = $handoverStage->pcAsset;
            if ($pcAsset) {
                $pcAsset->status = $pcAsset->computeStatus();
                $pcAsset->save();
            }
        });

        static::deleted(function ($handoverStage) {
            $pcAsset = $handoverStage->pcAsset;
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

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actioned_by');
    }
}
