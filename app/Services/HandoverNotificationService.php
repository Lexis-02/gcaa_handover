<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\PcAsset;
use App\Models\User;
use App\Notifications\HandoverActionRequired;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

class HandoverNotificationService
{
    public function __construct(
        private readonly HandoverSignOffService $signOff,
    ) {}

    public function notifyPendingSigners(PcAsset $asset): void
    {
        $asset->loadMissing(['assignedStaff', 'department', 'handoverStages', 'oldPcReturn']);

        $stage = $this->signOff->pendingStageFor($asset);

        if ($stage !== null) {
            $this->notifyUsersForStage($asset, $stage);

            return;
        }

        if (
            $asset->status === 'stage_3_complete'
            && ! ($asset->oldPcReturn?->isFullyReturned() ?? false)
        ) {
            $this->notifyOldPcReturnRequired($asset);
        }
    }

    public function notifyUsersForStage(PcAsset $asset, int $stage): void
    {
        $users = $this->usersForStage($asset, $stage);

        if ($users->isEmpty()) {
            return;
        }

        $config = config("handover.stages.{$stage}", []);
        $headline = 'Sign-off required — '.$asset->ref_no;
        $message = sprintf(
            '%s is ready for %s (%s).',
            $asset->ref_no,
            $config['description'] ?? "stage {$stage}",
            $config['signer_role'] ?? 'your action',
        );

        $actionUrl = route('handover-sign-offs.index');

        foreach ($users as $user) {
            if ($this->hasUnreadFor($user, $asset->id, $stage)) {
                continue;
            }

            $user->notify(new HandoverActionRequired(
                $asset,
                $stage,
                $headline,
                $message,
                $actionUrl,
            ));
        }
    }

    private function notifyOldPcReturnRequired(PcAsset $asset): void
    {
        $stage = 0;
        $headline = 'Old PC return — '.$asset->ref_no;
        $message = 'Form 3 is complete. Record old PC return details or confirm data wipe and stores return.';
        $actionUrl = route('pc-handover.index');

        $endUsers = User::query()
            ->where('is_active', true)
            ->where('staff_id', $asset->assigned_staff_id)
            ->permission('old-pc.submit')
            ->get();

        $stores = User::query()
            ->where('is_active', true)
            ->permission('stage1.signoff')
            ->get();

        $users = $endUsers->merge($stores)->unique('id');

        foreach ($users as $user) {
            if ($this->hasUnreadFor($user, $asset->id, $stage)) {
                continue;
            }

            $user->notify(new HandoverActionRequired(
                $asset,
                $stage,
                $headline,
                $message,
                $actionUrl,
            ));
        }
    }

    /**
     * @return Collection<int, User>
     */
    private function usersForStage(PcAsset $asset, int $stage): Collection
    {
        $query = User::query()->where('is_active', true);

        return match ($stage) {
            1 => $query->permission('stage1.signoff')->get(),
            2 => $query
                ->permission('stage2.signoff')
                ->where('department_id', $asset->department_id)
                ->get(),
            3 => $query
                ->where('staff_id', $asset->assigned_staff_id)
                ->permission('stage3.signoff')
                ->get(),
            default => collect(),
        };
    }

    private function hasUnreadFor(User $user, int $pcAssetId, int $stage): bool
    {
        return $user->unreadNotifications()
            ->where('type', HandoverActionRequired::class)
            ->get()
            ->contains(function (DatabaseNotification $notification) use ($pcAssetId, $stage) {
                $data = $notification->data;

                return (int) ($data['pc_asset_id'] ?? 0) === $pcAssetId
                    && (int) ($data['stage'] ?? -1) === $stage;
            });
    }

    /**
     * @return array{unread_count: int, items: list<array<string, mixed>>}
     */
    public function feedFor(User $user, int $limit = 30): array
    {
        $notifications = $user->notifications()
            ->latest()
            ->limit($limit)
            ->get();

        return [
            'unread_count' => $user->unreadNotifications()->count(),
            'items' => $notifications->map(fn (DatabaseNotification $n) => [
                'id' => $n->id,
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at?->toIso8601String(),
                'created_human' => $n->created_at?->diffForHumans(),
                ...$n->data,
            ])->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function pollNewSince(User $user, ?string $sinceId = null): array
    {
        if ($sinceId === null || $sinceId === '') {
            return [];
        }

        $since = $user->notifications()->where('id', $sinceId)->first();

        if ($since === null) {
            return [];
        }

        return $user->unreadNotifications()
            ->where('created_at', '>', $since->created_at)
            ->latest()
            ->get()
            ->map(fn (DatabaseNotification $n) => [
            'id' => $n->id,
            'created_at' => $n->created_at?->toIso8601String(),
            ...$n->data,
        ])->all();
    }
}
