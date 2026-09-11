<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // NOTA DE ORDEN: esta tabla debe migrar ANTES que `leads`,
        // porque leads.referral_id es FK hacia referrals.id.
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('referrer_name');
            $table->string('referrer_email');
            $table->string('referrer_phone');
            $table->string('referred_name');
            $table->string('referred_email')->nullable();
            $table->string('referred_phone');
            $table->string('code')->unique();
            $table->foreignId('status_id')->constrained('statuses');
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->decimal('sale_amount', 12, 2)->nullable();
            $table->decimal('commission_percentage', 5, 2)->default(0);
            $table->decimal('commission_amount', 12, 2)->nullable();
            $table->timestamp('commission_paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
