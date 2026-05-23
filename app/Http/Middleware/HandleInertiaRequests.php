<?php

namespace App\Http\Middleware;

use App\Services\DashboardService;
use App\Services\HandoverNotificationService;
use App\Services\HandoverSignOffService;
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
        $signOff = app(HandoverSignOffService::class);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'notifications' => $user ? [
                'unread_count' => $user->unreadNotifications()->count(),
                'latest_id' => $user->notifications()->latest()->value('id'),
                'sign_off_queue' => $signOff->queueCountFor($user),
            ] : null,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'department_id' => $user->department_id,
                    'is_active' => $user->is_active,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'primary_role' => $dashboard->resolvePrimaryRole($user),
                ] : null,
            ],
            'navigation' => $user ? $dashboard->navigationFor($user) : ['main' => [], 'footer' => []],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
