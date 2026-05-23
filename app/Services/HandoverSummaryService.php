<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Batch;
use App\Models\Department;
use App\Models\PcAsset;
use App\Models\User;

class HandoverSummaryService
{
    /**
     * @return list<array{id: int, batch_code: string, year: int, label: string, total_pcs: int}>
     */
    public function batchOptions(): array
    {
        return Batch::query()
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->get(['id', 'batch_code', 'year', 'total_pcs'])
            ->map(fn (Batch $batch) => [
                'id' => $batch->id,
                'batch_code' => $batch->batch_code,
                'year' => $batch->year,
                'total_pcs' => $batch->total_pcs,
                'label' => "{$batch->batch_code} ({$batch->year})",
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function build(User $user, ?int $batchId = null, bool $viewAll = false): array
    {
        if ($viewAll) {
            return $this->buildAllBatchesView($user);
        }

        $batch = $batchId !== null
            ? Batch::query()->find($batchId)
            : Batch::query()->orderByDesc('year')->orderByDesc('id')->first();

        return $this->buildBatchView($user, $batch);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildAllBatchesView(User $user): array
    {
        $deptScope = $this->departmentScope($user);
        $batches = Batch::query()->orderByDesc('year')->orderByDesc('id')->get();
        $batchComparison = [];
        $totals = [
            'total_in_batch' => 0,
            'registered' => 0,
            'pending' => 0,
            'stage_1' => 0,
            'stage_2' => 0,
            'stage_3' => 0,
            'complete' => 0,
            'faulty_on_arrival' => 0,
        ];

        foreach ($batches as $batch) {
            $overall = $this->countsForBatch($batch, $deptScope);
            $batchComparison[] = [
                'id' => $batch->id,
                'batch_code' => $batch->batch_code,
                'year' => $batch->year,
                'label' => $batch->batch_code,
                'total_pcs' => $overall['total_in_batch'],
                'registered' => $overall['registered'],
                'complete' => $overall['complete'],
                'percent_complete' => $overall['percent_complete'],
            ];

            foreach (array_keys($totals) as $key) {
                $totals[$key] += $overall[$key];
            }
        }

        $totals['percent_complete'] = $totals['total_in_batch'] > 0
            ? round(($totals['complete'] / $totals['total_in_batch']) * 100, 1)
            : 0.0;

        $assetQuery = PcAsset::query();
        if ($deptScope !== null) {
            $assetQuery->where('department_id', $deptScope);
        }

        return [
            'view_mode' => 'all',
            'batch' => null,
            'overall' => $totals,
            'pipeline' => $this->pipelineFromOverall($totals),
            'completion_split' => $this->completionSplit($totals),
            'by_department' => $this->departmentBreakdown(null, $deptScope),
            'batch_comparison' => $batchComparison,
            'scoped_to_department' => $deptScope !== null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildBatchView(User $user, ?Batch $batch): array
    {
        $deptScope = $this->departmentScope($user);
        $overall = $this->countsForBatch($batch, $deptScope);

        return [
            'view_mode' => 'batch',
            'batch' => $batch ? [
                'id' => $batch->id,
                'batch_code' => $batch->batch_code,
                'year' => $batch->year,
                'total_pcs' => $batch->total_pcs,
                'registered' => $overall['registered'],
            ] : null,
            'overall' => $overall,
            'pipeline' => $this->pipelineFromOverall($overall),
            'completion_split' => $this->completionSplit($overall),
            'by_department' => $this->departmentBreakdown($batch, $deptScope),
            'batch_comparison' => [],
            'scoped_to_department' => $deptScope !== null,
        ];
    }

    /**
     * @return array<string, int|float>
     */
    private function countsForBatch(?Batch $batch, ?int $deptScope): array
    {
        $assetQuery = PcAsset::query();

        if ($batch) {
            $assetQuery->where('batch_id', $batch->id);
        }

        if ($deptScope !== null) {
            $assetQuery->where('department_id', $deptScope);
        }

        $statusCounts = (clone $assetQuery)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $registered = (int) $statusCounts->sum();
        $totalInBatch = $batch?->total_pcs ?? $registered;

        $pending = (int) ($statusCounts['pending'] ?? 0);
        $stage1 = (int) ($statusCounts['stage_1_complete'] ?? 0);
        $stage2 = (int) ($statusCounts['stage_2_complete'] ?? 0);
        $stage3 = (int) ($statusCounts['stage_3_complete'] ?? 0);
        $complete = (int) ($statusCounts['complete'] ?? 0);
        $faulty = (int) ($statusCounts['faulty_on_arrival'] ?? 0);

        return [
            'total_in_batch' => $totalInBatch,
            'registered' => $registered,
            'pending' => $pending,
            'stage_1' => $stage1,
            'stage_2' => $stage2,
            'stage_3' => $stage3,
            'complete' => $complete,
            'faulty_on_arrival' => $faulty,
            'percent_complete' => $totalInBatch > 0
                ? round(($complete / $totalInBatch) * 100, 1)
                : 0.0,
            'unregistered_slots' => max(0, $totalInBatch - $registered),
        ];
    }

    /**
     * @param  array<string, int|float>  $overall
     * @return list<array{label: string, count: int, fill: string}>
     */
    private function pipelineFromOverall(array $overall): array
    {
        return [
            ['label' => 'Pending', 'count' => (int) $overall['pending'], 'fill' => 'hsl(var(--chart-3))'],
            ['label' => 'Stage 1', 'count' => (int) $overall['stage_1'], 'fill' => 'hsl(var(--chart-1))'],
            ['label' => 'Stage 2', 'count' => (int) $overall['stage_2'], 'fill' => 'hsl(var(--chart-4))'],
            ['label' => 'Stage 3', 'count' => (int) $overall['stage_3'], 'fill' => 'hsl(var(--chart-5))'],
            ['label' => 'Complete', 'count' => (int) $overall['complete'], 'fill' => 'hsl(var(--chart-2))'],
        ];
    }

    /**
     * @param  array<string, int|float>  $overall
     * @return list<array{name: string, value: int, fill: string}>
     */
    private function completionSplit(array $overall): array
    {
        $complete = (int) $overall['complete'];
        $inPipeline = (int) $overall['pending']
            + (int) $overall['stage_1']
            + (int) $overall['stage_2']
            + (int) $overall['stage_3'];
        $unregistered = (int) ($overall['unregistered_slots'] ?? max(
            0,
            (int) $overall['total_in_batch'] - (int) $overall['registered'],
        ));
        $faulty = (int) $overall['faulty_on_arrival'];

        return array_values(array_filter([
            ['name' => 'Complete', 'value' => $complete, 'fill' => 'hsl(var(--chart-2))'],
            ['name' => 'In pipeline', 'value' => $inPipeline, 'fill' => 'hsl(var(--chart-1))'],
            ['name' => 'Not registered', 'value' => $unregistered, 'fill' => 'hsl(var(--muted-foreground) / 0.35)'],
            $faulty > 0
                ? ['name' => 'Faulty on arrival', 'value' => $faulty, 'fill' => 'hsl(var(--destructive))']
                : null,
        ]));
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function departmentBreakdown(?Batch $batch, ?int $departmentId): array
    {
        $departments = Department::query()
            ->where('is_active', true)
            ->when($departmentId !== null, fn ($q) => $q->where('id', $departmentId))
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return $departments->map(function (Department $department) use ($batch) {
            $query = PcAsset::query()->where('department_id', $department->id);

            if ($batch) {
                $query->where('batch_id', $batch->id);
            }

            $assigned = (clone $query)->count();
            $completed = (clone $query)->where('status', 'complete')->count();
            $inProgress = $assigned - $completed;
            $percent = $assigned > 0
                ? round(($completed / $assigned) * 100, 1)
                : 0.0;

            return [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'short_name' => strlen($department->name) > 22
                    ? $department->code
                    : $department->name,
                'assigned' => $assigned,
                'completed' => $completed,
                'in_progress' => max(0, $inProgress),
                'percent_complete' => $percent,
            ];
        })->all();
    }

    private function departmentScope(User $user): ?int
    {
        if ($user->can('reports.all')) {
            return null;
        }

        if ($user->can('reports.dept') && $user->department_id) {
            return (int) $user->department_id;
        }

        return null;
    }
}
