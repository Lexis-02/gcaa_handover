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
            $table->string('returned_to_stores_new')->nullable()->after('data_wiped_new');
        });

        DB::table('old_pc_returns')->orderBy('id')->each(function (object $row): void {
            DB::table('old_pc_returns')->where('id', $row->id)->update([
                'data_wiped_new' => $row->data_wiped ? 'Yes' : 'No',
                'returned_to_stores_new' => $row->returned_to_stores ? 'Yes' : 'No',
            ]);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropColumn(['data_wiped', 'returned_to_stores']);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->renameColumn('data_wiped_new', 'data_wiped');
            $table->renameColumn('returned_to_stores_new', 'returned_to_stores');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE old_pc_returns MODIFY condition VARCHAR(255) NOT NULL');
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
            $table->boolean('returned_to_stores_bool')->default(false);
        });

        DB::table('old_pc_returns')->orderBy('id')->each(function (object $row): void {
            DB::table('old_pc_returns')->where('id', $row->id)->update([
                'data_wiped_bool' => $row->data_wiped === 'Yes',
                'returned_to_stores_bool' => $row->returned_to_stores === 'Yes',
            ]);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropColumn(['data_wiped', 'returned_to_stores']);
        });

        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->renameColumn('data_wiped_bool', 'data_wiped');
            $table->renameColumn('returned_to_stores_bool', 'returned_to_stores');
        });
    }
};
