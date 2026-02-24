<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Reservation;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ReservationNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_gets_notification_when_reservation_is_submitted(): void
    {
        Notification::fake();

        $project = $this->createProject();

        $this->post(route('project.reserve', $project), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ])->assertRedirect();

        $reservation = Reservation::query()->firstOrFail();

        Notification::assertSentTo(
            $reservation,
            ReservationStatusNotification::class,
            fn (ReservationStatusNotification $notification): bool => $notification->status === 'submitted'
        );
    }

    public function test_customer_gets_notification_when_reservation_is_accepted(): void
    {
        Notification::fake();

        $project = $this->createProject();

        $reservation = Reservation::create([
            'project_id' => $project->id,
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '01000000000',
            'status' => 'pending',
        ]);

        Notification::assertSentTo(
            $reservation,
            ReservationStatusNotification::class,
            fn (ReservationStatusNotification $notification): bool => $notification->status === 'submitted'
        );

        Notification::fake();

        $reservation->update(['status' => 'accepted']);

        Notification::assertSentTo(
            $reservation,
            ReservationStatusNotification::class,
            fn (ReservationStatusNotification $notification): bool => $notification->status === 'accepted'
        );
    }

    private function createProject(): Project
    {
        return Project::create([
            'slug' => 'project-'.uniqid(),
            'name' => 'Test Project',
            'description' => 'Test project description',
            'type' => 'villa',
            'area_sqm' => 200,
            'location' => 'Cairo',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'is_featured' => false,
            'status' => 'available',
            'price_starts_at' => '100000',
            'image_url' => 'https://example.com/project.jpg',
        ]);
    }
}
