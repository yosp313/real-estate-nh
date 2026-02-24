<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class Reservation extends Model
{
    use Notifiable;

    protected $fillable = [
        'project_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'status',
    ];

    public function routeNotificationForMail(): string
    {
        return $this->customer_email;
    }

    /**
     * Get the project that this reservation belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
