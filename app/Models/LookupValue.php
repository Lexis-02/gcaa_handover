<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['type', 'label', 'sort_order', 'is_active'])]
class LookupValue extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public static function resolveTypeFromSlug(string $slug): ?string
    {
        foreach (config('lookups.value_types', []) as $type => $meta) {
            if (($meta['slug'] ?? '') === $slug) {
                return $type;
            }
        }

        return null;
    }

    public static function slugForType(string $type): ?string
    {
        return config("lookups.value_types.{$type}.slug");
    }
}
