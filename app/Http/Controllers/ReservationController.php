<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    /**
     * Store a new reservation (lead capture).
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        if (! $project->isAvailable()) {
            return back()->withErrors(['project' => __('messages.project_unavailable')]);
        }

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
            $project->reservations()->create([
                'customer_name' => $validated['name'],
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'status' => 'pending',
            ]);
        } catch (QueryException $exception) {
            if ((string) $exception->getCode() === '23000') {
                return back()->withErrors(['email' => __('messages.already_registered')]);
            }

            throw $exception;
        }

        return back()->with('success', __('messages.registration_success'));
    }
}
