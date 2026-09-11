<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // TODO: confirmar con cliente si TODAS las propiedades requieren traducción
        // o solo proyectos grandes (ver base-data.txt §7). Mientras tanto la tabla
        // existe pero su uso es opcional en el CMS.
        Schema::create('property_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->string('locale', 2);
            $table->text('description');
            $table->text('ideal_for_text')->nullable();
            $table->timestamps();

            $table->unique(['property_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_translations');
    }
};
