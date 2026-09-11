<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('property_type_id')->constrained('property_types');
            $table->foreignId('zone_id')->constrained('zones');
            $table->foreignId('status_id')->constrained('statuses');
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            // Nombre propio de ubicación: no se traduce (ver property_translations).
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('operation', ['venta', 'alquiler']);
            $table->decimal('area_total', 12, 2);
            $table->string('area_unit')->default('m2');
            $table->decimal('price', 12, 2)->nullable();
            $table->string('currency')->default('USD');
            $table->enum('price_type', ['total', 'por_m2']);
            $table->integer('lots_available')->nullable();
            $table->json('ideal_for')->nullable();
            // Imágenes vía tabla `media` polimórfica (decisión Día 1-2: sin featured_image/gallery).
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
