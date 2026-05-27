<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\PcAsset;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Sent to ICT admins (pc.manage) when a handover stage is signed off
 * or when an old PC return is recorded.
 * This is an informational notification — NO sound plays for it on the frontend.
 */
class HandoverCompletedStage extends Notification
{
    use Queueable;

    public function __construct(
        public readonly PcAsset $asset,
        public readonly User $signedBy,
        public readonly int $stage,
        public readonly string $headline,
        public readonly string $message,
        public readonly string $actionUrl,
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        $stageConfig = $this->stage > 0
            ? config("handover.stages.{$this->stage}", [])
            : [];

        return [
            'notification_type' => 'stage_completed',
            'pc_asset_id'       => $this->asset->id,
            'ref_no'            => $this->asset->ref_no,
            'stage'             => $this->stage,
            'stage_label'       => $stageConfig['label'] ?? ($this->stage === 0 ? 'Old PC Return' : "Stage {$this->stage}"),
            'stage_description' => $stageConfig['description'] ?? '',
            'signed_by'         => $this->signedBy->name,
            'headline'          => $this->headline,
            'message'           => $this->message,
            'action_url'        => $this->actionUrl,
            'end_user'          => $this->asset->assignedStaff?->full_name,
            'department'        => $this->asset->department?->name,
        ];
    }
}
