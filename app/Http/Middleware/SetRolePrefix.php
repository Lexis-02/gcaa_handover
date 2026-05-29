<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SetRolePrefix
{
    public function handle(Request $request, Closure $next)
    {
        $rolePrefix = $request->route()->parameter('role_prefix');
        
        if ($rolePrefix) {
            // Set the default for all future route() calls
            URL::defaults(['role_prefix' => $rolePrefix]);
            
            // Remove it so it doesn't get passed to controller methods that don't expect it
            $request->route()->forgetParameter('role_prefix');
        }

        return $next($request);
    }
}
