<?php

namespace App\Http\Controllers;

use App\Services\ContactService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function __construct(private ContactService $contactService) {}

    /**
     * Store a new contact inquiry.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:2000',
        ], [
            'name.required' => __('messages.name_required'),
            'email.required' => __('messages.email_required'),
            'email.email' => __('messages.email_invalid'),
            'message.required' => __('messages.message_required'),
        ]);

        $this->contactService->createContact($validated);

        return back()->with('success', true);
    }
}
