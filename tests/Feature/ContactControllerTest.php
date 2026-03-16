<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_contact_messages(): void
    {
        $response = $this->post(route('contact.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
            'message' => 'I want more details about your projects.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', __('messages.contact_success'));

        $this->assertDatabaseHas('contacts', [
            'email' => 'john@example.com',
            'is_read' => false,
        ]);
    }

    public function test_contact_endpoint_is_rate_limited(): void
    {
        for ($attempt = 1; $attempt <= 10; $attempt++) {
            $this->post(route('contact.store'), [
                'name' => 'User '.$attempt,
                'email' => "user{$attempt}@example.com",
                'phone' => '01000000000',
                'message' => 'Testing throttling.',
            ])->assertRedirect();
        }

        $this->post(route('contact.store'), [
            'name' => 'Blocked User',
            'email' => 'blocked@example.com',
            'phone' => '01000000000',
            'message' => 'This one should be throttled.',
        ])->assertStatus(429);
    }
}
