<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DailyRegisterSummary extends Notification
{
    use Queueable;

    public function __construct(
        public readonly int $totalRegistered,
        public readonly string $date
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'notification_type' => 'daily_summary',
            'headline'          => "Daily Summary — {$this->date}",
            'message'           => "{$this->totalRegistered} new PC(s) were added to the register today.",
            'action_url'        => route('pc-register.index', ['status' => 'pending']),
        ];
    }
}
