<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\UserInvitation;
use App\Services\UserInvitationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class RegisterInvitationController extends Controller
{
    public function __construct(
        private readonly UserInvitationService $invitations,
    ) {}

    public function create(Request $request, UserInvitation $invitation): Response
    {
        return Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'registerUrl' => $request->fullUrl(),
            'invitation' => $this->invitations->serializeForRegister($invitation),
        ]);
    }

    public function store(Request $request, UserInvitation $invitation, CreatesNewUsers $creator): RedirectResponse
    {
        $user = $creator->create($request->all());

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(config('fortify.home'));
    }
}
