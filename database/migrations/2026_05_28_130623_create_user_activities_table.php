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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type'); // e.g., login, signed_form_1, registered_pc
            $table->string('target_model')->nullable(); // e.g., App\Models\PcRegister
            $table->unsignedBigInteger('target_id')->nullable();
            $table->integer('duration_seconds')->nullable(); // Track time taken
            $table->json('meta_data')->nullable(); // IP, User Agent, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
