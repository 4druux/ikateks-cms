<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            $table->text('footer_description')->nullable();
            $table->text('footer_description_id')->nullable();

            $table->string('contact_phone_number')->nullable();
            $table->string('contact_phone_href')->nullable();
            $table->string('contact_email')->nullable();

            $table->text('location_address')->nullable();
            $table->text('location_address_id')->nullable();
            $table->string('location_href')->nullable();
            
            $table->json('social_links')->nullable();

            $table->string('company_name')->nullable();
            $table->string('copyright_text')->nullable();
            $table->string('copyright_text_id')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};