<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Role;

class UserManagementService
{
    /**
     * @return LengthAwarePaginator<int, User>
     */
    public function paginateUsers(?string $search, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()
            ->with(['department:id,name', 'staff:id,full_name'])
            ->orderBy('name');

        if ($search !== null && $search !== '') {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForList(User $user): array
    {
        $user->loadMissing(['department:id,name', 'staff:id,full_name']);

        $role = $user->getRoleNames()->first();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'department' => $user->department?->only(['id', 'name']),
            'staff' => $user->staff?->only(['id', 'full_name']),
            'role' => $role,
            'role_label' => $role ? $this->roleLabel($role) : null,
            'roles' => $user->getRoleNames()->values()->all(),
            'is_active' => $user->is_active,
            'last_login_at' => $user->last_login_at?->format('Y-m-d H:i'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForDetail(User $user): array
    {
        return [
            ...$this->serializeForList($user),
            'created_at' => $user->created_at?->format('Y-m-d'),
            'updated_at' => $user->updated_at?->format('Y-m-d H:i'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formOptions(): array
    {
        return [
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->where('name', 'registry_clerk')
                ->orderBy('name')
                ->pluck('name')
                ->values()
                ->all(),
            'role_labels' => Role::query()
                ->where('guard_name', 'web')
                ->where('name', 'registry_clerk')
                ->orderBy('name')
                ->pluck('name')
                ->mapWithKeys(fn (string $name) => [$name => $this->roleLabel($name)])
                ->all(),
            'departments' => Department::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
            'staff' => Staff::query()
                ->where('is_active', true)
                ->orderBy('full_name')
                ->get(['id', 'full_name', 'staff_number', 'department_id']),
        ];
    }

    public function roleLabel(string $role): string
    {
        return str_replace('_', ' ', ucwords($role, '_'));
    }
}
