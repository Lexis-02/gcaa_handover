<?php

namespace App\Http\Middleware;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $dashboard = app(DashboardService::class);
        $snapshot = $user ? $dashboard->userSnapshot($user) : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'notifications' => $snapshot ? [
                'unread_count' => $snapshot['unread_count'],
                'latest_id' => $snapshot['latest_notification_id'],
                'sign_off_queue' => $snapshot['sign_off_queue'],
            ] : null,
            'auth' => [
                'user' => $snapshot ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'department_id' => $user->department_id,
                    'is_active' => $user->is_active,
                    'roles' => $snapshot['roles'],
                    'primary_role' => $snapshot['primary_role'],
                ] : null,
            ],
            'navigation' => $snapshot ? $dashboard->navigationFor($user) : ['main' => [], 'footer' => []],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
