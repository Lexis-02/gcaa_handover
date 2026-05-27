<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Carbon\Carbon;
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

        $to = Carbon::parse(
            $request->filled('to')
                ? (string) $request->input('to')
                : now()->toDateString(),
        )->endOfDay();

        $from = Carbon::parse(
            $request->filled('from')
                ? (string) $request->input('from')
                : now()->subDays(6)->toDateString(),
        )->startOfDay();

        if ($from->gt($to)) {
            [$from, $to] = [
                $to->copy()->startOfDay(),
                $from->copy()->endOfDay(),
            ];
        }

        return Inertia::render('dashboard/index', [
            'role' => $role,
            'meta' => $this->dashboard->metaForRole($role),
            'stats' => $this->dashboard->statsFor($user, $role, $from, $to),
            'quick_links' => $this->dashboard->quickLinksFor($user, $role),
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }
}
