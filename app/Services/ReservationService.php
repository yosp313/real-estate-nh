<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Reservation;
use App\Services\Exceptions\DuplicateReservationException;
use App\Services\Exceptions\ReservationUnavailableException;
use Illuminate\Database\QueryException;

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
        } catch (QueryException $exception) {
            if ((string) $exception->getCode() === '23000') {
                throw new DuplicateReservationException(previous: $exception);
            }

            throw $exception;
        }
    }
}
