<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            // Tabla genérica: 'property' | 'project' | 'lead' | 'referral' (+ futuros sin migrar).
            $table->string('type');
            $table->string('name');
            $table->string('slug');
            $table->string('color')->default('#0C447C');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['type', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statuses');
    }
};
