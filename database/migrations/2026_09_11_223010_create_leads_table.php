<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            // Origen: contacto | vende_tu_propiedad | landing_proyecto | busca_propiedad | refiere_y_gana
            $table->string('source');
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('referral_id')->nullable()->constrained('referrals')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('status_id')->nullable()->constrained('statuses')->nullOnDelete();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('document_type')->nullable();
            $table->string('document_number')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('location')->nullable();
            $table->text('message')->nullable();
            // Campos variables según el formulario de origen (ver base-data.txt §11).
            $table->json('extra_data')->nullable();
            $table->json('attachments')->nullable();
            $table->boolean('accepted_data_policy')->default(false);
            $table->boolean('accepted_marketing_policy')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
