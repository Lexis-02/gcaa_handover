<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('old_pc_returns', function (Blueprint $table) {
            // Accessories returned
            $table->boolean('acc_power_adapter')->default(false)->after('condition');
            $table->boolean('acc_carrying_bag')->default(false)->after('acc_power_adapter');
            $table->boolean('acc_hdmi_vga')->default(false)->after('acc_carrying_bag');
            $table->boolean('acc_mouse')->default(false)->after('acc_hdmi_vga');
            $table->boolean('acc_docking_station')->default(false)->after('acc_mouse');
            $table->boolean('acc_headset')->default(false)->after('acc_docking_station');
            $table->boolean('acc_keyboard')->default(false)->after('acc_headset');
            $table->boolean('acc_monitor')->default(false)->after('acc_keyboard');
            $table->string('acc_other')->nullable()->after('acc_monitor');

            // Data backup & wipe confirmations
            $table->boolean('dbw_user_backed_up')->default(false)->after('data_wiped');
            $table->boolean('dbw_ict_wiped')->default(false)->after('dbw_user_backed_up');
            $table->boolean('dbw_data_transferred')->default(false)->after('dbw_ict_wiped');
            $table->boolean('dbw_no_wipe_required')->default(false)->after('dbw_data_transferred');

            // Remarks
            $table->text('remarks')->nullable()->after('dbw_no_wipe_required');
        });
    }

    public function down(): void
    {
        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropColumn([
                'acc_power_adapter',
                'acc_carrying_bag',
                'acc_hdmi_vga',
                'acc_mouse',
                'acc_docking_station',
                'acc_headset',
                'acc_keyboard',
                'acc_monitor',
                'acc_other',
                'dbw_user_backed_up',
                'dbw_ict_wiped',
                'dbw_data_transferred',
                'dbw_no_wipe_required',
                'remarks',
            ]);
        });
    }
};
