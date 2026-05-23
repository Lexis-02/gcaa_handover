<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Services\DashboardService;
use App\Services\HandoverSignOffService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfilePageController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboard,
        private readonly HandoverSignOffService $signOff,
    ) {}

    public function show(Request $request): Response
    {
        $user = $request->user();
        $user->load(['department:id,name,code', 'staff:id,full_name,staff_number,designation']);

        $primaryRole = $this->dashboard->resolvePrimaryRole($user);
        $roleMeta = $this->dashboard->metaForRole($primaryRole);

        return Inertia::render('profile/index', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'is_active' => $user->is_active,
                'roles' => $user->getRoleNames()->values()->all(),
                'primary_role' => $primaryRole,
                'department' => $user->department?->only(['id', 'name', 'code']),
                'staff' => $user->staff ? [
                    'full_name' => $user->staff->full_name,
                    'staff_number' => $user->staff->staff_number,
                    'designation' => $user->staff->designation,
                ] : null,
                'last_login_at' => $user->last_login_at?->format('M j, Y g:i A'),
                'last_login_human' => $user->last_login_at?->diffForHumans(),
                'member_since' => $user->created_at?->format('M j, Y'),
            ],
            'role_meta' => $roleMeta,
            'stats' => [
                'sign_off_queue' => $this->signOff->queueCountFor($user),
                'unread_notifications' => $user->unreadNotifications()->count(),
            ],
            'must_verify_email' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profile updated successfully.',
        ]);

        return redirect()->route('profile.index');
    }
}
