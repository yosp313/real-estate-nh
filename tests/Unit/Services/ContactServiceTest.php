<?php

namespace Tests\Unit\Services;

use App\Services\ContactService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_contact_details(): void
    {
        $service = new ContactService;

        $contact = $service->createContact([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
            'message' => 'Tell me more.',
        ]);

        $this->assertSame('john@example.com', $contact->email);
        $this->assertFalse($contact->is_read);
        $this->assertDatabaseHas('contacts', [
            'email' => 'john@example.com',
            'is_read' => false,
        ]);
    }
}
