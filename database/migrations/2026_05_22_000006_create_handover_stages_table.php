<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handover_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pc_asset_id')->constrained('pc_assets')->onDelete('cascade');
            $table->unsignedTinyInteger('stage'); // 1, 2, or 3
            $table->foreignId('actioned_by')->constrained('users');
            $table->timestamp('actioned_at');
            $table->string('form_ref'); // e.g. ICT/PC-HO/01
            $table->text('notes')->nullable();
            $table->string('ip_address', 45);
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handover_stages');
    }
};
