<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pc_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->string('ref_no')->unique(); // Format: GCAA-PC-YYYY-NNN
            $table->string('asset_tag')->unique()->nullable();
            $table->string('make_model');
            $table->string('serial_number')->unique();
            $table->string('hostname')->unique()->nullable();
            $table->string('os')->default('Windows 11 Pro');
            $table->string('condition_on_issue')->default('Sealed/New');
            $table->enum('status', [
                'pending',
                'stage_1_complete',
                'stage_2_complete',
                'stage_3_complete',
                'complete',
                'faulty_on_arrival',
                'on_hold'
            ])->default('pending');
            $table->foreignId('assigned_staff_id')->nullable()->constrained('staff')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('building_id')->nullable()->constrained('buildings')->onDelete('set null');
            $table->string('room_ext')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pc_assets');
    }
};
