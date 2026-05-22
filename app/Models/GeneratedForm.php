<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'pc_asset_id',
    'form_type',
    'file_path',
    'generated_by',
    'generated_at',
    'downloaded_count'
])]
class GeneratedForm extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'generated_at' => 'datetime',
            'downloaded_count' => 'integer',
        ];
    }

    public function pcAsset(): BelongsTo
    {
        return $this->belongsTo(PcAsset::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
