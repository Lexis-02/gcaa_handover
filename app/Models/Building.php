<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'region', 'is_active'])]
class Building extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
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
