<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureValidInvitation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Checks that the URL signature is cryptographically valid and hasn't expired.
        if (! $request->hasValidSignature()) {
            abort(403, 'This registration link is invalid or has expired. Please request a new invitation link from the administrator.');
        }

        return $next($request);
    }
}
