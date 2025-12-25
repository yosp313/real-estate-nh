<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Store a new reservation (lead capture).
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        // 1. Validate the input
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|min:10',
        ]);

        // 2. Check for duplicates (prevent spam)
        $exists = $project->reservations()
                          ->where('customer_email', $validated['email'])
                          ->exists();

        if ($exists) {
            return back()->withErrors(['email' => 'You have already registered for this project.']);
        }

        // 3. Create the reservation
        $project->reservations()->create([
            'customer_name'  => $validated['name'],
            'customer_email' => $validated['email'],
            'customer_phone' => $validated['phone'],
        ]);

        // 4. Redirect back with success message
        return back()->with('success', 'Registration successful! We will contact you.');
    }
}
