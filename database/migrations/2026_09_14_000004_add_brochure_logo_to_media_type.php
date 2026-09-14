<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @var list<string>
     */
    private const TYPES = ['featured', 'gallery', 'attachment', 'document', 'brochure', 'logo'];

    /**
     * @var list<string>
     */
    private const LEGACY_TYPES = ['featured', 'gallery', 'attachment', 'document'];

    private const INDEX = 'media_mediable_id_mediable_type_index';

    /**
     * Amplía el enum sin doctrine/dbal: reconstruye la tabla (driver-agnostic,
     * MySQL local + SQLite de tests) copiando todas las filas.
     */
    public function up(): void
    {
        $this->rebuild(self::TYPES);
    }

    public function down(): void
    {
        DB::table('media')->whereIn('type', ['brochure', 'logo'])->delete();

        $this->rebuild(self::LEGACY_TYPES);
    }

    /**
     * @param  list<string>  $types
     */
    private function rebuild(array $types): void
    {
        Schema::rename('media', 'media_legacy');
        // El rename conserva el índice con su nombre original: soltarlo por
        // nombre explícito antes de recrear la tabla (si no, choca en SQLite
        // donde los nombres de índice son globales al esquema).
        Schema::table('media_legacy', function (Blueprint $table) {
            $table->dropIndex(self::INDEX);
        });

        Schema::create('media', function (Blueprint $table) use ($types) {
            $table->id();
            $table->unsignedBigInteger('mediable_id');
            $table->string('mediable_type');
            $table->enum('type', $types);
            $table->string('path');
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedInteger('size')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->string('alt_text')->nullable();
            $table->timestamps();

            $table->index(['mediable_id', 'mediable_type']);
        });

        DB::table('media')->insertUsing(self::columns(), DB::table('media_legacy')->select(self::columns()));

        Schema::drop('media_legacy');
    }

    /**
     * @return list<string>
     */
    private static function columns(): array
    {
        return ['id', 'mediable_id', 'mediable_type', 'type', 'path', 'original_name', 'mime_type', 'size', 'order', 'alt_text', 'created_at', 'updated_at'];
    }
};
