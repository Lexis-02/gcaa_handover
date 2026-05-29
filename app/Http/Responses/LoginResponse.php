<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = Auth::user();

        if ($user->hasRole('ict_admin')) {
            return redirect('/admin/dashboard');
        }

        if ($user->hasRole('registry_clerk')) {
            return redirect('/register-clerk/dashboard');
        }

        return redirect(config('fortify.home'));
    }
}
