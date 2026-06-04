<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\HandoverSummaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SummaryExport;

class SummaryController extends Controller
{
    public function __construct(
        private readonly HandoverSummaryService $summary,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($this->canView($request), 403);

        $batchParam = $request->string('batch')->trim()->toString();
        $viewAll = $batchParam === '' || $batchParam === 'all';
        $batchId = (! $viewAll && $batchParam !== '')
            ? (int) $batchParam
            : null;

        return Inertia::render('summary/index', [
            'summary' => $this->summary->build($request->user(), $batchId, $viewAll),
            'batches' => $this->summary->batchOptions(),
            'selected_batch' => $viewAll ? 'all' : (string) ($batchId ?? ''),
        ]);
    }

    public function exportExcel(Request $request)
    {
        abort_unless($this->canView($request), 403);

        $batchParam = $request->string('batch')->trim()->toString();
        $viewAll = $batchParam === '' || $batchParam === 'all';
        $batchId = (! $viewAll && $batchParam !== '')
            ? (int) $batchParam
            : null;

        $data = $this->summary->build($request->user(), $batchId, $viewAll);

        return Excel::download(new SummaryExport($data), 'handover-summary.xlsx');
    }

    private function canView(Request $request): bool
    {
        $user = $request->user();

        return $user?->can('reports.all')
            || $user?->can('reports.dept')
            || $user?->can('stage.manage-all')
            || $user?->can('pc.manage');
    }
}
