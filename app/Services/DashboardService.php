<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Batch;
use App\Models\PcAsset;
use App\Models\User;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Resolve the primary dashboard role for a user.
     */
    public function resolvePrimaryRole(User $user): string
    {
        $userRoles = $user->getRoleNames();

        foreach (config('dashboard.role_priority', []) as $role) {
            if ($userRoles->contains($role)) {
                return $role;
            }
        }

        return config('dashboard.default_role', 'end_user');
    }

    /**
     * @return array<string, mixed>
     */
    public function metaForRole(string $role): array
    {
        $roles = config('dashboard.roles', []);

        return $roles[$role] ?? $roles[config('dashboard.default_role', 'end_user')];
    }

    /**
     * @return array<string, mixed>
     */
    public function statsFor(User $user, string $role): array
    {
        $pcBase = PcAsset::query();
        $statusCounts = (clone $pcBase)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $totalPcs = (int) $statusCounts->sum();
        $complete = (int) ($statusCounts['complete'] ?? 0);
        $pending = (int) ($statusCounts['pending'] ?? 0);
        $inProgress = $totalPcs - $complete - $pending - (int) ($statusCounts['faulty_on_arrival'] ?? 0);

        $pendingStage1 = (clone $pcBase)->where('status', 'pending')->count();
        $pendingStage2 = (clone $pcBase)->where('status', 'stage_1_complete')->count();
        $pendingStage3 = (clone $pcBase)->where('status', 'stage_2_complete')->count();
        $awaitingReturn = (clone $pcBase)->where('status', 'stage_3_complete')->count();

        $batchCount = Batch::query()->count();

        $pipeline = [
            ['label' => 'Pending', 'value' => $pending, 'color' => 'chart-3'],
            ['label' => 'Stage 1', 'value' => (int) ($statusCounts['stage_1_complete'] ?? 0), 'color' => 'chart-1'],
            ['label' => 'Stage 2', 'value' => (int) ($statusCounts['stage_2_complete'] ?? 0), 'color' => 'chart-2'],
            ['label' => 'Stage 3', 'value' => (int) ($statusCounts['stage_3_complete'] ?? 0), 'color' => 'chart-4'],
            ['label' => 'Complete', 'value' => $complete, 'color' => 'chart-2'],
        ];

        $recent = (clone $pcBase)
            ->with(['department:id,name', 'assignedStaff:id,full_name'])
            ->latest('updated_at')
            ->limit(5)
            ->get(['id', 'ref_no', 'make_model', 'status', 'department_id', 'assigned_staff_id', 'updated_at'])
            ->map(fn (PcAsset $asset) => [
                'id' => $asset->ref_no,
                'name' => $asset->make_model,
                'status' => $asset->status,
                'department' => $asset->department?->name,
                'assignee' => $asset->assignedStaff?->full_name,
                'updated_at' => $asset->updated_at?->diffForHumans(),
            ]);

        $roleKpis = match ($role) {
            'stores_officer' => [
                ['label' => 'Awaiting Stage 1', 'value' => $pendingStage1, 'trend' => null, 'icon' => 'clipboard-check'],
                ['label' => 'Stage 1 Complete', 'value' => (int) ($statusCounts['stage_1_complete'] ?? 0), 'trend' => null, 'icon' => 'check-circle'],
                ['label' => 'Forms Ready', 'value' => $pendingStage1, 'trend' => null, 'icon' => 'file-text'],
                ['label' => 'Total PCs', 'value' => $totalPcs, 'trend' => null, 'icon' => 'monitor'],
            ],
            'director' => [
                ['label' => 'Awaiting Stage 2', 'value' => $pendingStage2, 'trend' => null, 'icon' => 'stamp'],
                ['label' => 'Dept. In Progress', 'value' => $inProgress, 'trend' => null, 'icon' => 'activity'],
                ['label' => 'Dept. Complete', 'value' => $complete, 'trend' => null, 'icon' => 'badge-check'],
                ['label' => 'Dept. PCs', 'value' => $totalPcs, 'trend' => null, 'icon' => 'building-2'],
            ],
            'end_user' => [
                ['label' => 'My PCs', 'value' => $totalPcs, 'trend' => null, 'icon' => 'laptop'],
                ['label' => 'Action Required', 'value' => $pendingStage3 + $awaitingReturn, 'trend' => null, 'icon' => 'bell'],
                ['label' => 'Completed', 'value' => $complete, 'trend' => null, 'icon' => 'check-circle'],
                ['label' => 'Old PC Return', 'value' => $awaitingReturn, 'trend' => null, 'icon' => 'rotate-ccw'],
            ],
            'auditor' => [
                ['label' => 'Total PCs', 'value' => $totalPcs, 'trend' => null, 'icon' => 'monitor'],
                ['label' => 'Complete', 'value' => $complete, 'trend' => $totalPcs > 0 ? round(($complete / max($totalPcs, 1)) * 100, 1) : 0, 'icon' => 'percent', 'trend_suffix' => '%'],
                ['label' => 'In Pipeline', 'value' => $inProgress + $pending, 'trend' => null, 'icon' => 'git-branch'],
                ['label' => 'Batches', 'value' => $batchCount, 'trend' => null, 'icon' => 'package'],
            ],
            default => [
                ['label' => 'Total PCs', 'value' => $totalPcs, 'trend' => null, 'icon' => 'monitor'],
                ['label' => 'Batches', 'value' => $batchCount, 'trend' => null, 'icon' => 'package'],
                ['label' => 'In Progress', 'value' => $inProgress + $pending, 'trend' => null, 'icon' => 'activity'],
                ['label' => 'Completed', 'value' => $complete, 'trend' => $totalPcs > 0 ? round(($complete / max($totalPcs, 1)) * 100, 1) : 0, 'icon' => 'badge-check', 'trend_suffix' => '%'],
            ],
        };

        return [
            'role' => $role,
            'kpis' => $roleKpis,
            'pipeline' => $pipeline,
            'recent' => $recent,
            'summary' => [
                'total_pcs' => $totalPcs,
                'complete' => $complete,
                'pending_stage_1' => $pendingStage1,
                'pending_stage_2' => $pendingStage2,
                'pending_stage_3' => $pendingStage3,
                'awaiting_return' => $awaitingReturn,
                'completion_rate' => $totalPcs > 0 ? round(($complete / $totalPcs) * 100, 1) : 0,
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function navigationFor(User $user): array
    {
        $permissions = $user->getAllPermissions()->pluck('name');
        $roles = $user->getRoleNames();

        return [
            'main' => $this->filterNavItems(config('navigation.main', []), $roles, $permissions, []),
            'footer' => $this->filterNavItems(config('navigation.footer', []), $roles, $permissions, []),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $items
     * @return list<array<string, mixed>>
     */
    private function filterNavItems(array $items, Collection $roles, Collection $permissions, array $badges): array
    {
        return collect($items)
            ->filter(function (array $item) use ($roles, $permissions) {
                return $this->navItemVisibleToUser($item, $roles, $permissions);
            })
            ->map(function (array $item) use ($badges, $permissions, $roles) {
                $slug = $item['slug'] ?? str($item['title'])->slug()->toString();
                $nav = [
                    'title' => $item['title'],
                    'icon' => $item['icon'],
                    'href' => isset($item['route']) ? route($item['route']) : ($item['href'] ?? '#'),
                ];

                if (! empty($item['children'])) {
                    $nav['children'] = collect($item['children'])
                        ->filter(fn (array $child) => $this->navItemVisibleToUser($child, $roles, $permissions))
                        ->map(fn (array $child) => array_filter([
                            'title' => $child['title'],
                            'icon' => $child['icon'] ?? 'circle',
                            'href' => isset($child['route'])
                                ? route($child['route'], $child['route_params'] ?? [])
                                : ($child['href'] ?? '#'.$slug.'-'.($child['action'] ?? str($child['title'])->slug())),
                            'match' => $child['match'] ?? null,
                        ], fn ($value) => $value !== null))
                        ->values()
                        ->all();
                }

                if (! empty($item['badge']) && ($badges[$item['badge']] ?? 0) > 0) {
                    $nav['badge'] = (string) $badges[$item['badge']];
                }

                return $nav;
            })
            ->filter(function (array $nav) {
                if (array_key_exists('children', $nav) && $nav['children'] === []) {
                    return false;
                }

                return true;
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function navItemVisibleToUser(array $item, Collection $roles, Collection $permissions): bool
    {
        $excludedRoles = $item['exclude_roles'] ?? null;
        if ($excludedRoles && $roles->intersect($excludedRoles)->isNotEmpty()) {
            return false;
        }

        $allowedRoles = $item['roles'] ?? null;
        if ($allowedRoles && ! in_array('*', $allowedRoles, true)) {
            if ($roles->intersect($allowedRoles)->isEmpty()) {
                return false;
            }
        }

        $requiredPermissions = $item['permissions'] ?? null;
        if ($requiredPermissions) {
            return $permissions->intersect($requiredPermissions)->isNotEmpty();
        }

        return true;
    }
}
