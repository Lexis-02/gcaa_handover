<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pc_assets', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('handover_stages', function (Blueprint $table) {
            $table->index('actioned_at');
            $table->index(['pc_asset_id', 'stage']);
        });
    }

    public function down(): void
    {
        Schema::table('pc_assets', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('handover_stages', function (Blueprint $table) {
            $table->dropIndex(['actioned_at']);
            $table->dropIndex(['pc_asset_id', 'stage']);
        });
    }
};
