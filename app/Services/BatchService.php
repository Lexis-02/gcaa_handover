<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Batch;

class BatchService
{
    public function generateBatchCode(int $year): string
    {
        $sequence = Batch::query()->where('year', $year)->count() + 1;

        return sprintf('GCAA-%d-B%02d', $year, $sequence);
    }

    public function computeSerialTo(string $serialFrom, int $totalPcs): string
    {
        $start = (int) $serialFrom;
        $end = $start + $totalPcs - 1;
        $padding = max(3, strlen((string) $end));

        return str_pad((string) $end, $padding, '0', STR_PAD_LEFT);
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForList(Batch $batch): array
    {
        return [
            'id' => $batch->id,
            'batch_code' => $batch->batch_code,
            'year' => $batch->year,
            'total_pcs' => $batch->total_pcs,
            'serial_from' => $batch->serial_from,
            'serial_to' => $batch->serial_to,
            'notes' => $batch->notes,
            'pcs_registered' => $batch->pc_assets_count ?? $batch->pcAssets()->count(),
            'created_at' => $batch->created_at?->format('Y-m-d'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForDetail(Batch $batch): array
    {
        return [
            ...$this->serializeForList($batch),
            'notes' => $batch->notes,
            'created_by_name' => $batch->creator?->name,
            'updated_at' => $batch->updated_at?->format('Y-m-d H:i'),
        ];
    }
}
