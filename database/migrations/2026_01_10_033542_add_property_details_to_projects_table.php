<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('type')->default('apartment')->after('description'); // apartment, villa, townhouse, duplex, penthouse, studio
            $table->integer('area_sqm')->nullable()->after('type'); // Area in square meters
            $table->string('location')->nullable()->after('area_sqm'); // Location/City
            $table->integer('bedrooms')->nullable()->after('location');
            $table->integer('bathrooms')->nullable()->after('bedrooms');
            $table->boolean('is_featured')->default(false)->after('bathrooms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['type', 'area_sqm', 'location', 'bedrooms', 'bathrooms', 'is_featured']);
        });
    }
};
