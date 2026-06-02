<?php

declare(strict_types=1);

namespace App\Http\Controllers\Lookups;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lookups\StoreLookupValueRequest;
use App\Http\Requests\Lookups\UpdateLookupValueRequest;
use App\Models\LookupValue;
use App\Models\OldPcReturn;
use App\Models\PcAsset;
use App\Services\LookupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LookupValueController extends Controller
{
    public function __construct(
        private readonly LookupService $lookups,
    ) {}

    public function index(Request $request, string $type): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $resolvedType = $this->resolveType($type);
        $meta = $this->lookups->typeMeta($resolvedType);

        return Inertia::render('lookups/values/index', [
            'type' => $resolvedType,
            'typeSlug' => $type,
            'title' => $meta['title'],
            'records' => $this->lookups->valuesForType($resolvedType),
        ]);
    }

    public function create(Request $request, string $type): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $resolvedType = $this->resolveType($type);
        $meta = $this->lookups->typeMeta($resolvedType);

        return Inertia::render('lookups/values/form', [
            'type' => $resolvedType,
            'typeSlug' => $type,
            'title' => $meta['title'],
            'record' => null,
        ]);
    }

    public function store(StoreLookupValueRequest $request, string $type): RedirectResponse
    {
        $resolvedType = $this->resolveType($type);

        LookupValue::query()->create([
            'type' => $resolvedType,
            'label' => $request->validated('label'),
            'sort_order' => $request->validated('sort_order') ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lookup value added.',
        ]);

        return redirect()->route('lookups.values.index', ['type' => $type]);
    }

    public function show(Request $request, string $type, LookupValue $lookup_value): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $this->assertTypeMatch($type, $lookup_value);
        $meta = $this->lookups->typeMeta($lookup_value->type);

        return Inertia::render('lookups/values/show', [
            'typeSlug' => $type,
            'title' => $meta['title'],
            'record' => $lookup_value,
        ]);
    }

    public function edit(Request $request, string $type, LookupValue $lookup_value): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $this->assertTypeMatch($type, $lookup_value);
        $meta = $this->lookups->typeMeta($lookup_value->type);

        return Inertia::render('lookups/values/form', [
            'type' => $lookup_value->type,
            'typeSlug' => $type,
            'title' => $meta['title'],
            'record' => $lookup_value->only(['id', 'label', 'sort_order', 'is_active']),
        ]);
    }

    public function update(UpdateLookupValueRequest $request, string $type, LookupValue $lookup_value): RedirectResponse
    {
        $this->assertTypeMatch($type, $lookup_value);

        $oldLabel = $lookup_value->label;
        $newLabel = $request->validated('label');

        $lookup_value->update([
            'label' => $newLabel,
            'sort_order' => $request->validated('sort_order') ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($oldLabel !== $newLabel) {
            if ($lookup_value->type === 'pc_condition') {
                PcAsset::query()
                    ->where('condition_on_issue', $oldLabel)
                    ->update(['condition_on_issue' => $newLabel]);
            } elseif ($lookup_value->type === 'old_pc_condition') {
                OldPcReturn::query()
                    ->where('condition', $oldLabel)
                    ->update(['condition' => $newLabel]);
            } elseif ($lookup_value->type === 'os') {
                PcAsset::query()
                    ->where('os', $oldLabel)
                    ->update(['os' => $newLabel]);
            } elseif ($lookup_value->type === 'yes_no') {
                OldPcReturn::query()
                    ->where('data_wiped', $oldLabel)
                    ->update(['data_wiped' => $newLabel]);
                OldPcReturn::query()
                    ->where('returned_to_stores', $oldLabel)
                    ->update(['returned_to_stores' => $newLabel]);
            }
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lookup value updated.',
        ]);

        return redirect()->route('lookups.values.index', ['type' => $type]);
    }

    public function destroy(Request $request, string $type, LookupValue $lookup_value): RedirectResponse
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $this->assertTypeMatch($type, $lookup_value);

        $inUse = false;

        if ($lookup_value->type === 'pc_condition') {
            $inUse = PcAsset::query()->where('condition_on_issue', $lookup_value->label)->exists();
        } elseif ($lookup_value->type === 'old_pc_condition') {
            $inUse = OldPcReturn::query()->where('condition', $lookup_value->label)->exists();
        } elseif ($lookup_value->type === 'os') {
            $inUse = PcAsset::query()->where('os', $lookup_value->label)->exists();
        } elseif ($lookup_value->type === 'yes_no') {
            $inUse = OldPcReturn::query()->where('data_wiped', $lookup_value->label)
                ->orWhere('returned_to_stores', $lookup_value->label)->exists();
        }

        if ($inUse) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete — this value is actively used in system records.',
            ]);

            return redirect()->route('lookups.values.index', ['type' => $type]);
        }

        $lookup_value->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lookup value deleted.',
        ]);

        return redirect()->route('lookups.values.index', ['type' => $type]);
    }

    private function resolveType(string $slug): string
    {
        $type = LookupValue::resolveTypeFromSlug($slug);
        abort_unless($type, 404);

        return $type;
    }

    private function assertTypeMatch(string $slug, LookupValue $value): void
    {
        abort_unless(LookupValue::resolveTypeFromSlug($slug) === $value->type, 404);
    }
}
