<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'type',
        'area_sqm',
        'location',
        'bedrooms',
        'bathrooms',
        'is_featured',
        'price_starts_at',
        'image_url',
    ];

    protected $casts = [
        'area_sqm' => 'integer',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'is_featured' => 'boolean',
    ];

    /**
     * Get all reservations for this project.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
