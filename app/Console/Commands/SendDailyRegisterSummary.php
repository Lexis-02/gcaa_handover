<?php

namespace App\Console\Commands;

use App\Models\PcAsset;
use App\Models\User;
use App\Notifications\DailyRegisterSummary;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

#[Signature('app:send-daily-register-summary')]
#[Description('Sends a daily summary of newly registered PCs to ICT Admins')]
class SendDailyRegisterSummary extends Command
{
    public function handle(): int
    {
        $today = Carbon::today();
        
        $count = PcAsset::query()
            ->withoutGlobalScopes()
            ->whereDate('created_at', $today)
            ->count();

        if ($count === 0) {
            $this->info('No PCs registered today. Skipping notification.');
            return self::SUCCESS;
        }

        $admins = User::query()
            ->where('is_active', true)
            ->permission('pc.manage') // ICT Admin permission
            ->get();

        if ($admins->isEmpty()) {
            $this->warn('No active ICT Admins found.');
            return self::FAILURE;
        }

        $dateString = $today->format('Y-m-d');
        
        foreach ($admins as $admin) {
            $admin->notify(new DailyRegisterSummary($count, $dateString));
        }

        $this->info("Sent daily summary ({$count} PCs) to {$admins->count()} admin(s).");
        return self::SUCCESS;
    }
}
