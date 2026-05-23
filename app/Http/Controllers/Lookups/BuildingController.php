<?php

declare(strict_types=1);

namespace App\Http\Controllers\Lookups;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lookups\StoreBuildingRequest;
use App\Http\Requests\Lookups\UpdateBuildingRequest;
use App\Models\Building;
use App\Models\PcAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuildingController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $records = Building::query()->orderBy('name')->get();

        return Inertia::render('lookups/buildings/index', [
            'records' => $records,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/buildings/form', [
            'record' => null,
        ]);
    }

    public function store(StoreBuildingRequest $request): RedirectResponse
    {
        Building::query()->create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Building added.',
        ]);

        return redirect()->route('lookups.buildings.index');
    }

    public function show(Request $request, Building $building): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/buildings/show', [
            'record' => $building,
        ]);
    }

    public function edit(Request $request, Building $building): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/buildings/form', [
            'record' => $building->only(['id', 'name', 'region', 'is_active']),
        ]);
    }

    public function update(UpdateBuildingRequest $request, Building $building): RedirectResponse
    {
        $building->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Building updated.',
        ]);

        return redirect()->route('lookups.buildings.index');
    }

    public function destroy(Request $request, Building $building): RedirectResponse
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        if (PcAsset::query()->where('building_id', $building->id)->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete — PCs are assigned to this building.',
            ]);

            return redirect()->route('lookups.buildings.index');
        }

        $building->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Building deleted.',
        ]);

        return redirect()->route('lookups.buildings.index');
    }
}
