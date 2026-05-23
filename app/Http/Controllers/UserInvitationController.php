<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserInvitationRequest;
use App\Models\UserInvitation;
use App\Services\UserInvitationService;
use App\Services\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserInvitationController extends Controller
{
    public function __construct(
        private readonly UserInvitationService $invitations,
        private readonly UserManagementService $users,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        $formOptions = $this->users->formOptions();

        return Inertia::render('users/invitations/index', [
            'invitations' => $this->invitations->recentInvitations(
                config('invitations.list_limit', 15),
            )->values()->all(),
            'options' => [
                'roles' => $formOptions['roles'],
                'role_labels' => $formOptions['role_labels'],
                'departments' => $formOptions['departments'],
                'invitation_expiry_days' => config('invitations.expiry_days', 7),
            ],
            'flash_invitation_link' => $request->session()->get('invitation_link'),
        ]);
    }

    public function store(StoreUserInvitationRequest $request): RedirectResponse
    {
        $invitation = $this->invitations->create(
            $request->user(),
            $request->validated(),
        );

        $url = $this->invitations->signedRegistrationUrl($invitation);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Registration link generated. Copy it and send it to the new user.',
        ]);

        Inertia::flash('invitation_link', $url);

        return redirect()->route('users.invitations.index');
    }

    public function destroy(Request $request, UserInvitation $invitation): RedirectResponse
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        if ($invitation->isUsed()) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'This invitation was already used and cannot be revoked.',
            ]);

            return redirect()->route('users.invitations.index');
        }

        $invitation->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Invitation link revoked.',
        ]);

        return redirect()->route('users.invitations.index');
    }
}
