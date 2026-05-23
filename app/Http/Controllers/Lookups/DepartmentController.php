<?php

declare(strict_types=1);

namespace App\Http\Controllers\Lookups;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lookups\StoreDepartmentRequest;
use App\Http\Requests\Lookups\UpdateDepartmentRequest;
use App\Models\Department;
use App\Models\PcAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        $records = Department::query()->orderBy('name')->get();

        return Inertia::render('lookups/departments/index', [
            'records' => $records,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/departments/form', [
            'record' => null,
        ]);
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::query()->create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Department added.',
        ]);

        return redirect()->route('lookups.departments.index');
    }

    public function show(Request $request, Department $department): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/departments/show', [
            'record' => $department,
        ]);
    }

    public function edit(Request $request, Department $department): Response
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        return Inertia::render('lookups/departments/form', [
            'record' => $department->only(['id', 'name', 'code', 'is_active']),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Department updated.',
        ]);

        return redirect()->route('lookups.departments.index');
    }

    public function destroy(Request $request, Department $department): RedirectResponse
    {
        abort_unless($request->user()?->can('config.manage'), 403);

        if (PcAsset::query()->where('department_id', $department->id)->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete — PCs are assigned to this department.',
            ]);

            return redirect()->route('lookups.departments.index');
        }

        $department->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Department deleted.',
        ]);

        return redirect()->route('lookups.departments.index');
    }
}
