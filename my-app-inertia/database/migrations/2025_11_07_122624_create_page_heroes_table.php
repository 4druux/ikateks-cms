<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_heroes', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique()->comment('Identifier for the page, e.g., "home", "about"');
            
            $table->string('title');
            $table->string('title_id');
            $table->string('subtitle')->nullable();
            $table->string('subtitle_id')->nullable();
            $table->text('description');
            $table->text('description_id');

            $table->string('media_type')->default('image')->comment('e.g., "image" or "video"');
            $table->string('media_path')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_heroes');
    }
};