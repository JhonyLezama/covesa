<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_translations', function (Blueprint $table) {
            // Esquina superior de la landing (Día 3 Semana 5): línea pequeña
            // + línea grande del distintivo del proyecto. Editable desde
            // Admin → Proyectos. Si hay logo subido, el logo manda.
            $table->string('badge_top', 100)->nullable()->after('subtitle');
            $table->string('badge_title', 100)->nullable()->after('badge_top');
        });
    }

    public function down(): void
    {
        Schema::table('project_translations', function (Blueprint $table) {
            $table->dropColumn(['badge_top', 'badge_title']);
        });
    }
};
