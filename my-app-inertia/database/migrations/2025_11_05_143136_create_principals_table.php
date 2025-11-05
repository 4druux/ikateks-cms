<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('principals', function (Blueprint $table) {
            $table->id();
            
            $table->string('title');
            $table->string('title_id');
            $table->text('description');
            $table->text('description_id');
            $table->string('icon_name');
            $table->json('methodology');
            $table->json('methodology_id');
            $table->unsignedSmallInteger('order')->default(0); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('principals');
    }
};