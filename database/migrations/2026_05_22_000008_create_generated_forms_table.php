<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pc_asset_id')->constrained('pc_assets')->onDelete('cascade');
            $table->enum('form_type', ['HO01', 'HO02', 'HO03']);
            $table->string('file_path');
            $table->foreignId('generated_by')->constrained('users');
            $table->timestamp('generated_at');
            $table->integer('downloaded_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_forms');
    }
};
