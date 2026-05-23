<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\HandoverNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private readonly HandoverNotificationService $notifications,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user, 403);

        $feed = $this->notifications->feedFor($user, 50);

        $stages = collect(config('handover.stages', []))
            ->filter(fn ($_, $key) => is_int($key))
            ->values()
            ->all();

        return Inertia::render('notifications/index', [
            'notifications' => $feed['items'],
            'unread_count' => $feed['unread_count'],
            'stages' => $stages,
        ]);
    }

    public function poll(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user, 403);

        $sinceId = $request->string('since')->toString() ?: null;
        $newItems = $this->notifications->pollNewSince($user, $sinceId);

        return response()->json([
            'unread_count' => $user->unreadNotifications()->count(),
            'new' => $newItems,
            'latest_id' => $user->notifications()->latest()->value('id'),
        ]);
    }

    public function markRead(Request $request, string $notification): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);

        $user->notifications()->where('id', $notification)->first()?->markAsRead();

        return back();
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);

        $user->unreadNotifications->markAsRead();

        return back();
    }
}
