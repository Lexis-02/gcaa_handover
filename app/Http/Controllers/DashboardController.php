<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboard,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $this->dashboard->resolvePrimaryRole($user);

        return Inertia::render('dashboard/index', [
            'role' => $role,
            'meta' => $this->dashboard->metaForRole($role),
        ]);
    }
}
