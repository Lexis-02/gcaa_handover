<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('staff_number')->unique();
            $table->string('designation');
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('building_id')->constrained('buildings');
            $table->string('email')->unique();
            $table->string('phone');
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
