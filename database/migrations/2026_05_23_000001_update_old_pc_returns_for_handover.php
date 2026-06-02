<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('old_pc_returns')) {
            return;
        }

        $dataWipedType = Schema::getColumnType('old_pc_returns', 'data_wiped');

        if ($dataWipedType === 'string') {
            return;
        }

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->string('data_wiped_new')->nullable()->after('reason_for_replacement');
        });

        DB::table('old_pc_returns')->orderBy('id')->each(function (object $row): void {
            DB::table('old_pc_returns')->where('id', $row->id)->update([
                'data_wiped_new' => $row->data_wiped ? 'Yes' : 'No',
            ]);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropColumn(['data_wiped']);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->renameColumn('data_wiped_new', 'data_wiped');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE old_pc_returns MODIFY `condition` VARCHAR(255) NOT NULL');
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('old_pc_returns')) {
            return;
        }

        $dataWipedType = Schema::getColumnType('old_pc_returns', 'data_wiped');

        if ($dataWipedType !== 'string') {
            return;
        }

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->boolean('data_wiped_bool')->default(false);
        });

        DB::table('old_pc_returns')->orderBy('id')->each(function (object $row): void {
            DB::table('old_pc_returns')->where('id', $row->id)->update([
                'data_wiped_bool' => $row->data_wiped === 'Yes',
            ]);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropColumn(['data_wiped']);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->renameColumn('data_wiped_bool', 'data_wiped');
        });
    }
};
