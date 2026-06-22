<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Reservation;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    /**
     * @param  array{name: string, email: string, phone: string}  $data
     */
    public function createReservation(Project $project, array $data): Reservation
    {
        if (! $project->isAvailable()) {
            throw ValidationException::withMessages([
                'project' => __('messages.reservation_unavailable'),
            ]);
        }

        try {
            return $project->reservations()->create([
                'customer_name' => $data['name'],
                'customer_email' => $data['email'],
                'customer_phone' => $data['phone'],
                'status' => 'pending',
            ]);
        } catch (UniqueConstraintViolationException $exception) {
            throw ValidationException::withMessages([
                'email' => __('messages.already_registered'),
            ]);
        }
    }
}