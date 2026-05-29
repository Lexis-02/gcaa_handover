<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\LookupValue;
use Illuminate\Support\Collection;

class LookupService
{
    /**
     * @return list<string>
     */
    public function labels(string $type): array
    {
        $labels = LookupValue::query()
            ->where('type', $type)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('label')
            ->pluck('label')
            ->all();

        if ($labels !== []) {
            return $labels;
        }

        return config("lookups.fallbacks.{$type}", []);
    }

    public function pcConditions(): array
    {
        return $this->labels('pc_condition');
    }

    public function oldPcConditions(): array
    {
        return $this->labels('old_pc_condition');
    }

    public function yesNoOptions(): array
    {
        return $this->labels('yes_no');
    }

    public function osOptions(): array
    {
        return $this->labels('os');
    }

    /**
     * @return Collection<int, LookupValue>
     */
    public function valuesForType(string $type): Collection
    {
        return LookupValue::query()
            ->where('type', $type)
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get();
    }

    public function typeMeta(string $type): array
    {
        return config("lookups.value_types.{$type}", [
            'title' => str($type)->headline()->toString(),
            'slug' => str($type)->slug(),
        ]);
    }
}
