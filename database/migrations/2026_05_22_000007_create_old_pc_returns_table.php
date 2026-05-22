<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('old_pc_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pc_asset_id')->constrained('pc_assets')->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->string('old_asset_tag')->nullable();
            $table->string('old_make_model');
            $table->string('old_serial_no');
            $table->integer('year_of_purchase')->nullable();
            $table->enum('condition', ['Working', 'Minor Defect', 'Beyond Repair', 'Scrap']);
            $table->text('reason_for_replacement')->nullable();
            $table->boolean('data_wiped')->default(false);
            $table->string('data_wiped_by')->nullable();
            $table->timestamp('data_wiped_at')->nullable();
            $table->boolean('returned_to_stores')->default(false);
            $table->timestamp('returned_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('old_pc_returns');
    }
};
