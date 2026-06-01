<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
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

        $search = $request->string('q')->trim()->toString();

        $query = Batch::query()->withCount('pcAssets');

        if ($search !== '') {
            $query->where('batch_code', 'like', "%{$search}%")
                ->orWhere('year', 'like', "%{$search}%")
                ->orWhere('notes', 'like', "%{$search}%");
        }

        $records = $query
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Batch $batch) => [
                ...$this->batches->serializeForList($batch),
                'can_delete' => $batch->pc_assets_count === 0,
                'can_edit' => true,
            ]);

        return Inertia::render('batches/index', [
            'batches' => $records,
            'filters' => [
                'q' => $search,
            ],
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

    public function show(Request $request, Batch $batch): Response
    {
        abort_unless($request->user()?->can('batch.create'), 403);

        $batch->loadCount('pcAssets')->load('creator:id,name');

        return Inertia::render('batches/show', [
            'batch' => $this->batches->serializeForDetail($batch),
            'meta' => [
                'can_edit' => true,
                'can_delete' => $batch->pc_assets_count === 0,
            ],
        ]);
    }

    public function edit(Request $request, Batch $batch): Response
    {
        abort_unless($request->user()?->can('batch.create'), 403);

        $batch->loadCount('pcAssets');

        return Inertia::render('batches/edit', [
            'batch' => $batch->only([
                'id', 'batch_code', 'year', 'total_pcs', 'serial_from', 'serial_to', 'notes',
            ]),
            'meta' => [
                'has_pcs' => $batch->pc_assets_count > 0,
            ],
        ]);
    }

    public function update(UpdateBatchRequest $request, Batch $batch): RedirectResponse
    {
        $batch->loadCount('pcAssets');
        $totalPcs = (int) $request->validated('total_pcs');

        if ($batch->pc_assets_count > $totalPcs) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "Total PCs cannot be less than {$batch->pc_assets_count} already registered.",
            ]);

            return redirect()->route('batches.edit', $batch);
        }

        $serialFrom = $request->validated('serial_from');

        $batch->update([
            'total_pcs' => $totalPcs,
            'serial_from' => $serialFrom,
            'serial_to' => $this->batches->computeSerialTo($serialFrom, $totalPcs),
            'notes' => $request->validated('notes'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Batch updated.',
        ]);

        return redirect()->route('batches.show', $batch);
    }

    public function destroy(Request $request, Batch $batch): RedirectResponse
    {
        abort_unless($request->user()?->can('batch.create'), 403);

        if ($batch->pcAssets()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a batch that has PCs in the register.',
            ]);

            return redirect()->route('batches.show', $batch);
        }

        $code = $batch->batch_code;
        $batch->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Batch {$code} deleted.",
        ]);

        return redirect()->route('batches.index');
    }
}
