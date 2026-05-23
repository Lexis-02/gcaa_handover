<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBatchRequest;
use App\Models\Batch;
use App\Services\BatchService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    public function __construct(
        private readonly BatchService $batches,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('batch.create'), 403);

        $records = Batch::query()
            ->withCount('pcAssets')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Batch $batch) => $this->batches->serializeForList($batch));

        return Inertia::render('batches/index', [
            'batches' => $records,
            'meta' => [
                'can_create' => $request->user()->can('batch.create'),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('batch.create'), 403);

        return Inertia::render('batches/create', [
            'defaults' => [
                'year' => (int) date('Y'),
                'total_pcs' => 56,
                'serial_from' => '001',
            ],
        ]);
    }

    public function store(StoreBatchRequest $request): RedirectResponse
    {
        $year = (int) $request->validated('year');
        $totalPcs = (int) $request->validated('total_pcs');
        $serialFrom = $request->validated('serial_from');

        $batch = Batch::query()->create([
            'batch_code' => $this->batches->generateBatchCode($year),
            'year' => $year,
            'total_pcs' => $totalPcs,
            'serial_from' => $serialFrom,
            'serial_to' => $this->batches->computeSerialTo($serialFrom, $totalPcs),
            'notes' => $request->validated('notes'),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Batch {$batch->batch_code} created. You can now add PCs to the register.",
        ]);

        return redirect()->route('batches.index');
    }
}
