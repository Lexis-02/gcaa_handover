<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pc_assets', function (Blueprint $table) {
            // Accessories issued
            $table->boolean('acc_power_adapter')->default(false)->after('room_ext');
            $table->boolean('acc_carrying_bag')->default(false)->after('acc_power_adapter');
            $table->boolean('acc_hdmi_vga')->default(false)->after('acc_carrying_bag');
            $table->boolean('acc_mouse')->default(false)->after('acc_hdmi_vga');
            $table->boolean('acc_docking_station')->default(false)->after('acc_mouse');
            $table->boolean('acc_headset')->default(false)->after('acc_docking_station');
            $table->boolean('acc_keyboard')->default(false)->after('acc_headset');
            $table->boolean('acc_monitor')->default(false)->after('acc_keyboard');
            $table->string('acc_other')->nullable()->after('acc_monitor');
        });
    }

    public function down(): void
    {
        Schema::table('pc_assets', function (Blueprint $table) {
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
            ]);
        });
    }
};
