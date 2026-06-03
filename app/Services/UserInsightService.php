<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserInsightService
{
    /**
     * Get insight data for the dashboard.
     */
    public function getDashboardData(?int $departmentId = null, ?string $from = null, ?string $to = null)
    {
        $fromDate = $from ? Carbon::parse($from)->startOfDay() : Carbon::now()->subDays(30)->startOfDay();
        $toDate = $to ? Carbon::parse($to)->endOfDay() : Carbon::now()->endOfDay();

        $usersQuery = User::query();
        if ($departmentId) {
            $usersQuery->where('department_id', $departmentId);
        }
        
        $userIds = $usersQuery->pluck('id');

        // Heatmap Data (Date Range)
        $heatmapData = UserActivity::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->whereIn('user_id', $userIds)
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Bottlenecks (Users with the most "pending" or long duration tasks)
        // Since we are mocking the prediction, we use average duration
        $bottlenecks = UserActivity::with('user')
            ->select('user_id', DB::raw('AVG(duration_seconds) as avg_duration'), DB::raw('count(*) as tasks_count'))
            ->whereIn('user_id', $userIds)
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->whereNotNull('duration_seconds')
            ->groupBy('user_id')
            ->orderByDesc('avg_duration')
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'user' => $activity->user->full_name ?? 'Unknown',
                    'avg_duration' => round($activity->avg_duration / 3600, 1), // in hours
                    'tasks_count' => $activity->tasks_count,
                ];
            });

        // Top Performers (Most tasks completed quickly)
        $topPerformers = UserActivity::with('user')
            ->select('user_id', DB::raw('count(*) as tasks_count'))
            ->whereIn('user_id', $userIds)
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->groupBy('user_id')
            ->orderByDesc('tasks_count')
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'user' => $activity->user->full_name ?? 'Unknown',
                    'tasks_count' => $activity->tasks_count,
                ];
            });

        // Scatter Graph Data (All users for bottleneck visualization)
        $scatterData = UserActivity::with('user')
            ->select('user_id', DB::raw('AVG(duration_seconds) as avg_duration'), DB::raw('count(*) as tasks_count'))
            ->whereIn('user_id', $userIds)
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->whereNotNull('duration_seconds')
            ->groupBy('user_id')
            ->take(50)
            ->get()
            ->map(function ($activity) {
                return [
                    'user' => $activity->user->full_name ?? 'Unknown',
                    'avg_duration' => round($activity->avg_duration / 3600, 1),
                    'tasks_count' => $activity->tasks_count,
                ];
            });

        return [
            'heatmap' => $heatmapData,
            'scatterData' => $scatterData,
            'bottlenecks' => $bottlenecks,
            'topPerformers' => $topPerformers,
        ];
    }
}
