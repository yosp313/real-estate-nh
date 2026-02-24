<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Notifications\ReservationStatusNotification;

class ReservationObserver
{
    public function created(Reservation $reservation): void
    {
        $reservation->loadMissing('project');
        $reservation->notify(new ReservationStatusNotification($reservation, 'submitted'));
    }

    public function updated(Reservation $reservation): void
    {
        if (! $reservation->wasChanged('status')) {
            return;
        }

        $reservation->loadMissing('project');
        $reservation->notify(new ReservationStatusNotification($reservation, $reservation->status));
    }
}
