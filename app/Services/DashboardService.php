<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Batch;
use App\Models\HandoverStage;
use App\Models\PcAsset;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class DashboardService
{
    public function __construct(
        private readonly HandoverSignOffService $signOff,
    ) {}

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
    public function statsFor(User $user, string $role, Carbon $from, Carbon $to): array
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

        $stage1 = (int) ($statusCounts['stage_1_complete'] ?? 0);
        $stage2 = (int) ($statusCounts['stage_2_complete'] ?? 0);
        $stage3 = (int) ($statusCounts['stage_3_complete'] ?? 0);

        $pipeline = [
            ['label' => 'Pending', 'value' => $pending, 'fill' => '#f97316'],
            ['label' => 'Stage 1', 'value' => $stage1, 'fill' => '#1990cf'],
            ['label' => 'Stage 2', 'value' => $stage2, 'fill' => '#14b8a6'],
            ['label' => 'Stage 3', 'value' => $stage3, 'fill' => '#8b5cf6'],
            ['label' => 'Complete', 'value' => $complete, 'fill' => '#10b981'],
        ];

        $pipelineChart = collect($pipeline)
            ->map(fn (array $segment) => [
                'label' => $segment['label'],
                'count' => $segment['value'],
                'fill' => $segment['fill'],
            ])
            ->values()
            ->all();

        $weeklyActivity = $this->activityForRange($pcBase, $from, $to);

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

        $signOffQueue = $this->signOff->queueCountFor($user);
        $unreadNotifications = $user->unreadNotifications()->count();

        $insights = config('dashboard.insights', []);
        $insight = $insights[$role] ?? $insights[config('dashboard.default_role', 'end_user')] ?? [];

        return [
            'role' => $role,
            'kpis' => $roleKpis,
            'pipeline' => $pipeline,
            'pipeline_chart' => $pipelineChart,
            'weekly_activity' => $weeklyActivity,
            'can_view_register' => $user->can('pc.view')
                || $user->can('pc.view-dept')
                || $user->can('pc.view-own')
                || $user->can('stage.manage-all')
                || $user->can('pc.manage'),
            'insight' => [
                'title' => $insight['title'] ?? 'Handover overview',
                'body' => $insight['body'] ?? 'Track progress across your assigned scope.',
                'cta' => $insight['cta'] ?? 'Get started',
                'href' => isset($insight['route']) ? route($insight['route']) : route('dashboard'),
            ],
            'summary' => [
                'total_pcs' => $totalPcs,
                'complete' => $complete,
                'pending_stage_1' => $pendingStage1,
                'pending_stage_2' => $pendingStage2,
                'pending_stage_3' => $pendingStage3,
                'awaiting_return' => $awaitingReturn,
                'completion_rate' => $totalPcs > 0 ? round(($complete / $totalPcs) * 100, 1) : 0,
                'sign_off_queue' => $signOffQueue,
                'unread_notifications' => $unreadNotifications,
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function quickLinksFor(User $user, string $role): array
    {
        $definitions = config("dashboard.quick_links.{$role}")
            ?? config('dashboard.quick_links.default', []);

        $permissions = $user->getAllPermissions()->pluck('name');
        $badges = [
            'sign_off_queue' => $this->signOff->queueCountFor($user),
            'unread_notifications' => $user->unreadNotifications()->count(),
        ];

        return collect($definitions)
            ->filter(function (array $link) use ($permissions) {
                $required = $link['permissions'] ?? null;
                if ($required === null) {
                    return true;
                }

                return $permissions->intersect($required)->isNotEmpty();
            })
            ->map(function (array $link) use ($badges) {
                $badgeKey = $link['badge_key'] ?? null;
                $badge = $badgeKey !== null ? ($badges[$badgeKey] ?? 0) : 0;

                return [
                    'title' => $link['title'],
                    'description' => $link['description'],
                    'icon' => $link['icon'],
                    'href' => route($link['route']),
                    'badge' => $badge > 0 ? $badge : null,
                ];
            })
            ->values()
            ->all();
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
     * Sign-off actions per day within the selected date range.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<PcAsset>  $pcBase
     * @return list<array{label: string, date: string, count: int}>
     */
    private function activityForRange($pcBase, Carbon $from, Carbon $to): array
    {
        $fromDay = $from->copy()->startOfDay();
        $toDay = $to->copy()->startOfDay();

        $period = CarbonPeriod::create($fromDay, '1 day', $toDay);
        $days = iterator_to_array($period, false);

        if (count($days) > 31) {
            $days = array_slice($days, -31);
        }

        $assetIds = (clone $pcBase)->pluck('id');

        $countsByDay = collect();
        if ($assetIds->isNotEmpty()) {
            $countsByDay = HandoverStage::query()
                ->whereIn('pc_asset_id', $assetIds)
                ->whereBetween('actioned_at', [$fromDay, $to->copy()->endOfDay()])
                ->selectRaw('DATE(actioned_at) as activity_date, COUNT(*) as total')
                ->groupBy('activity_date')
                ->pluck('total', 'activity_date');
        }

        return collect($days)
            ->map(function (Carbon $day) use ($countsByDay) {
                $key = $day->toDateString();

                return [
                    'label' => $day->format('d M'),
                    'date' => $key,
                    'count' => (int) ($countsByDay[$key] ?? 0),
                ];
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
