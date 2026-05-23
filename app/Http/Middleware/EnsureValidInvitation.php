<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\UserInvitation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureValidInvitation
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'This registration link is invalid or has expired. Please request a new invitation link from the administrator.');
        }

        $invitation = $request->route('invitation');

        if ($invitation instanceof UserInvitation) {
            if ($invitation->isUsed()) {
                abort(403, 'This registration link has already been used. Please request a new invitation from the administrator.');
            }

            if ($invitation->isExpired()) {
                abort(403, 'This registration link has expired. Please request a new invitation from the administrator.');
            }
        }

        return $next($request);
    }
}
