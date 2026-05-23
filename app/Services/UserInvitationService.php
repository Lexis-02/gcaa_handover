<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\URL;

class UserInvitationService
{
    /**
     * @param  array{role: string, department_id?: int|null, label?: string|null, expiry_days?: int}  $data
     */
    public function create(User $creator, array $data): UserInvitation
    {
        $days = $data['expiry_days'] ?? config('invitations.expiry_days', 7);

        return UserInvitation::query()->create([
            'created_by' => $creator->id,
            'role' => $data['role'],
            'department_id' => $data['department_id'] ?? null,
            'label' => $data['label'] ?? null,
            'expires_at' => now()->addDays(max(1, (int) $days)),
        ]);
    }

    public function signedRegistrationUrl(UserInvitation $invitation): string
    {
        return URL::temporarySignedRoute(
            'register',
            $invitation->expires_at,
            ['invitation' => $invitation],
            absolute: true,
        );
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function recentInvitations(int $limit = 15): Collection
    {
        return UserInvitation::query()
            ->with([
                'creator:id,name',
                'department:id,name',
                'registeredUser:id,name,username',
            ])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (UserInvitation $invitation) => $this->serialize($invitation));
    }

    /**
     * @return array<string, mixed>
     */
    public function serialize(UserInvitation $invitation): array
    {
        $invitation->loadMissing(['creator:id,name', 'department:id,name', 'registeredUser:id,name,username']);

        return [
            'id' => $invitation->id,
            'role' => $invitation->role,
            'role_label' => $this->roleLabel($invitation->role),
            'label' => $invitation->label,
            'department' => $invitation->department?->only(['id', 'name']),
            'expires_at' => $invitation->expires_at->format('Y-m-d H:i'),
            'expires_human' => $invitation->expires_at->diffForHumans(),
            'used_at' => $invitation->used_at?->format('Y-m-d H:i'),
            'status' => $this->statusFor($invitation),
            'created_by' => $invitation->creator?->only(['id', 'name']),
            'registered_user' => $invitation->registeredUser?->only(['id', 'name', 'username']),
            'registration_url' => $invitation->isValid()
                ? $this->signedRegistrationUrl($invitation)
                : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function serializeForRegister(UserInvitation $invitation): array
    {
        return [
            'role' => $invitation->role,
            'role_label' => $this->roleLabel($invitation->role),
            'department' => $invitation->department?->only(['id', 'name']),
            'expires_at' => $invitation->expires_at->format('d M Y'),
        ];
    }

    public function roleLabel(string $role): string
    {
        return str_replace('_', ' ', ucwords($role, '_'));
    }

    private function statusFor(UserInvitation $invitation): string
    {
        if ($invitation->isUsed()) {
            return 'used';
        }

        if ($invitation->isExpired()) {
            return 'expired';
        }

        return 'active';
    }
}
