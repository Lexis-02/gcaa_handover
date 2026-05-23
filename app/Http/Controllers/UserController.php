<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Staff;
use App\Models\User;
use App\Services\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserManagementService $users,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        $search = $request->string('q')->trim()->toString();
        $paginator = $this->users->paginateUsers($search !== '' ? $search : null);

        return Inertia::render('users/index', [
            'records' => $paginator->through(fn (User $user) => [
                ...$this->users->serializeForList($user),
                'can_delete' => $user->id !== $request->user()->id,
            ]),
            'filters' => ['q' => $search],
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        return Inertia::render('users/create', [
            'options' => $this->users->formOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::query()->create([
            'name' => $request->validated('name'),
            'username' => $request->validated('username'),
            'password' => $request->validated('password'),
            'department_id' => $request->validated('department_id'),
            'staff_id' => $request->validated('staff_id'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        $user->syncRoles([$request->validated('role')]);

        if ($user->staff_id) {
            Staff::query()
                ->where('id', $user->staff_id)
                ->update(['user_id' => $user->id]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'User account created.',
        ]);

        return redirect()->route('users.show', $user);
    }

    public function show(Request $request, User $user): Response
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        $user->load(['department:id,name', 'staff:id,full_name,staff_number']);

        return Inertia::render('users/show', [
            'record' => $this->users->serializeForDetail($user),
            'meta' => [
                'can_edit' => true,
                'can_delete' => $user->id !== $request->user()->id,
            ],
        ]);
    }

    public function edit(Request $request, User $user): Response
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        return Inertia::render('users/edit', [
            'record' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->getRoleNames()->first(),
                'department_id' => $user->department_id,
                'staff_id' => $user->staff_id,
                'is_active' => $user->is_active,
            ],
            'options' => $this->users->formOptions(),
            'meta' => [
                'is_self' => $user->id === $request->user()->id,
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = [
            'name' => $request->validated('name'),
            'username' => $request->validated('username'),
            'department_id' => $request->validated('department_id'),
            'staff_id' => $request->validated('staff_id'),
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($user->id === $request->user()->id) {
            $data['is_active'] = true;
        }

        if ($password = $request->validated('password')) {
            $data['password'] = $password;
        }

        $user->update($data);
        $user->syncRoles([$request->validated('role')]);

        if ($user->staff_id) {
            Staff::query()
                ->where('id', $user->staff_id)
                ->update(['user_id' => $user->id]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'User account updated.',
        ]);

        return redirect()->route('users.show', $user);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->can('users.manage'), 403);

        if ($user->id === $request->user()->id) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'You cannot delete your own account.',
            ]);

            return redirect()->route('users.show', $user);
        }

        $name = $user->name;
        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "User {$name} removed.",
        ]);

        return redirect()->route('users.index');
    }
}
