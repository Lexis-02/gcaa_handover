<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'code', 'director_staff_id', 'is_active'])]
class Department extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function director(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'director_staff_id');
    }

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }

    public function pcAssets(): HasMany
    {
        return $this->hasMany(PcAsset::class);
    }
}
