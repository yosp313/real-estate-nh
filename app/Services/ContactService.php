<?php

namespace App\Services;

use App\Models\Contact;

class ContactService
{
    /**
     * @param  array{name: string, email: string, phone?: string|null, message: string}  $data
     */
    public function createContact(array $data): Contact
    {
        return Contact::create(array_merge([
            'is_read' => false,
        ], $data));
    }
}
