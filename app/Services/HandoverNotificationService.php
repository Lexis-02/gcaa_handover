<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\PcAsset;
use App\Models\User;
use App\Notifications\HandoverActionRequired;
use App\Notifications\HandoverCompletedStage;
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
     * Notify all active ICT admins (pc.manage) that a handover stage was signed off.
     * Skips the signer so they don't receive their own action.
     */
    public function notifyIctAdminsOfSignOff(PcAsset $asset, User $signer, int $stage): void
    {
        $stageConfig = config("handover.stages.{$stage}", []);
        $headline    = 'Handover signed — '.$asset->ref_no;
        $message     = sprintf(
            '%s has completed %s (%s) for %s.',
            $signer->name,
            $stageConfig['description'] ?? "stage {$stage}",
            $stageConfig['label'] ?? "Stage {$stage}",
            $asset->ref_no,
        );
        $actionUrl = route('pc-register.show', $asset);

        $admins = User::query()
            ->where('is_active', true)
            ->where('id', '!=', $signer->id)
            ->permission('pc.manage')
            ->get();

        foreach ($admins as $admin) {
            $admin->notify(new HandoverCompletedStage(
                $asset,
                $signer,
                $stage,
                $headline,
                $message,
                $actionUrl,
            ));
        }
    }

    /**
     * Notify ICT admins that an old PC return has been recorded.
     */
    public function notifyIctAdminsOfOldPcHandover(PcAsset $asset, User $actor): void
    {
        $headline  = 'Old PC return recorded — '.$asset->ref_no;
        $message   = sprintf(
            '%s recorded old PC return details for %s (%s).',
            $actor->name,
            $asset->ref_no,
            $asset->assignedStaff?->full_name ?? 'unknown user',
        );
        $actionUrl = route('pc-register.show', $asset);

        $admins = User::query()
            ->where('is_active', true)
            ->where('id', '!=', $actor->id)
            ->permission('pc.manage')
            ->get();

        foreach ($admins as $admin) {
            $admin->notify(new HandoverCompletedStage(
                $asset,
                $actor,
                0,
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
            2 => $query->permission('stage2.signoff')->get(),
            3 => $query->permission('stage3.signoff')->get(),
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
                'id'                => $n->id,
                'created_at'        => $n->created_at?->toIso8601String(),
                // Expose the notification class type so the frontend can decide
                // whether to play a sound (only for HandoverActionRequired).
                'notification_type' => $n->data['notification_type']
                    ?? ($n->type === HandoverActionRequired::class ? 'action_required' : 'stage_completed'),
                ...$n->data,
            ])->all();
    }
}
