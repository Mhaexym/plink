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
        Schema::create('plinks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('sharedPassword');
            $table->integer('uses');
            $table->integer('hoursLeft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plinks');
    }
};
