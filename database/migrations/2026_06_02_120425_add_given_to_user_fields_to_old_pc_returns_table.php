<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->string('old_hostname')->nullable()->after('old_serial_no');
            $table->string('given_to_fullname')->nullable()->after('return_action');
            $table->string('given_to_staff_number')->nullable()->after('given_to_fullname');
            $table->string('given_to_designation')->nullable()->after('given_to_staff_number');
            $table->foreignId('given_to_department_id')->nullable()->constrained('departments')->onDelete('set null')->after('given_to_designation');
            $table->string('given_to_telephone')->nullable()->after('given_to_department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('old_pc_returns', function (Blueprint $table) {
            $table->dropForeign(['given_to_department_id']);
            $table->dropColumn([
                'old_hostname',
                'given_to_fullname',
                'given_to_staff_number',
                'given_to_designation',
                'given_to_department_id',
                'given_to_telephone',
            ]);
        });
    }
};
