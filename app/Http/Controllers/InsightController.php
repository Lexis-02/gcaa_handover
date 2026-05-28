<?php

namespace App\Http\Controllers;

use App\Exports\InsightsExport;
use App\Services\UserInsightService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class InsightController extends Controller
{
    public function __construct(
        protected UserInsightService $insightService,
    ) {}

    private function resolveDepartmentId(Request $request): ?int
    {
        $user = $request->user();

        if ($user->hasRole('super_admin') || $user->hasRole('ict_admin')) {
            return null; // Global view — no scoping
        }

        if ($user->hasRole('director')) {
            return $user->department_id;
        }

        abort(403, 'You do not have permission to access Insights.');
    }

    public function index(Request $request)
    {
        $departmentId = $this->resolveDepartmentId($request);
        $data = $this->insightService->getDashboardData($departmentId);

        return Inertia::render('insights/index', [
            'insights' => $data,
            'scope' => $departmentId ? 'Department' : 'Global',
        ]);
    }

    public function exportPdf(Request $request)
    {
        $departmentId = $this->resolveDepartmentId($request);
        $data = $this->insightService->getDashboardData($departmentId);

        $pdf = Pdf::loadView('exports.insights-pdf', ['data' => $data]);

        return $pdf->download('user-insights-report.pdf');
    }

    public function exportExcel(Request $request)
    {
        $departmentId = $this->resolveDepartmentId($request);
        $data = $this->insightService->getDashboardData($departmentId);

        $exportData = [];
        foreach ($data['topPerformers'] as $tp) {
            $exportData[] = ['Top Performer', $tp['user'], 'Tasks Completed', $tp['tasks_count']];
        }
        foreach ($data['bottlenecks'] as $b) {
            $exportData[] = ['Bottleneck', $b['user'], 'Avg Time (Hours)', $b['avg_duration']];
        }

        return Excel::download(new InsightsExport($exportData), 'user-insights-report.xlsx');
    }
}
