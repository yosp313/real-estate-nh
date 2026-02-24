<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\Exceptions\DuplicateReservationException;
use App\Services\Exceptions\ReservationUnavailableException;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    public function __construct(private ReservationService $reservationService) {}

    /**
     * Store a new reservation (lead capture).
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('reservations', 'customer_email')->where(fn ($query) => $query->where('project_id', $project->id)),
            ],
            'phone' => 'required|string|min:10|max:50',
        ], [
            'email.unique' => __('messages.already_registered'),
        ]);

        try {
            $this->reservationService->createReservation($project, $validated);
        } catch (ReservationUnavailableException) {
            return back()->withErrors(['project' => __('messages.project_unavailable')]);
        } catch (DuplicateReservationException) {
            return back()->withErrors(['email' => __('messages.already_registered')]);
        }

        return back()->with('success', __('messages.registration_success'));
    }
}
