<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\PcAsset;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class HandoverActionRequired extends Notification
{
    use Queueable;

    public function __construct(
        public readonly PcAsset $asset,
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
        $stageConfig = config("handover.stages.{$this->stage}", []);

        return [
            'pc_asset_id' => $this->asset->id,
            'ref_no' => $this->asset->ref_no,
            'stage' => $this->stage,
            'stage_label' => $stageConfig['label'] ?? "Stage {$this->stage}",
            'stage_description' => $stageConfig['description'] ?? '',
            'signer_role' => $stageConfig['signer_role'] ?? null,
            'headline' => $this->headline,
            'message' => $this->message,
            'action_url' => $this->actionUrl,
            'end_user' => $this->asset->assignedStaff?->full_name,
            'department' => $this->asset->department?->name,
        ];
    }
}
