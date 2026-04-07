<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Reservation;
use App\Services\Exceptions\DuplicateReservationException;
use App\Services\Exceptions\ReservationUnavailableException;
use Illuminate\Database\UniqueConstraintViolationException;

class ReservationService
{
    /**
     * @param  array{name: string, email: string, phone: string}  $data
     */
    public function createReservation(Project $project, array $data): Reservation
    {
        if (! $project->isAvailable()) {
            throw new ReservationUnavailableException;
        }

        try {
            return $project->reservations()->create([
                'customer_name' => $data['name'],
                'customer_email' => $data['email'],
                'customer_phone' => $data['phone'],
                'status' => 'pending',
            ]);
        } catch (UniqueConstraintViolationException $exception) {
            throw new DuplicateReservationException(previous: $exception);
        }
    }
}
