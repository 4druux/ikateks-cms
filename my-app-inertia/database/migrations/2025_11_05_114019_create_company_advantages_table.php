<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_advantages', function (Blueprint $table) {
            $table->id();
            
            $table->string('title');
            $table->string('title_id');
            $table->text('description');
            $table->text('description_id');
            $table->string('icon_name');
            $table->unsignedSmallInteger('order')->default(0); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_advantages');
    }
};