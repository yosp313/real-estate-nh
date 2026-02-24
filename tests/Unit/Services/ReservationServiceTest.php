<?php

namespace Tests\Unit\Services;

use App\Models\Project;
use App\Services\Exceptions\DuplicateReservationException;
use App\Services\Exceptions\ReservationUnavailableException;
use App\Services\ReservationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_reservation_for_an_available_project(): void
    {
        $service = new ReservationService;
        $project = $this->createProject();

        $reservation = $service->createReservation($project, [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ]);

        $this->assertSame($project->id, $reservation->project_id);
        $this->assertSame('john@example.com', $reservation->customer_email);
        $this->assertDatabaseCount('reservations', 1);
    }

    public function test_it_throws_when_project_is_unavailable(): void
    {
        $service = new ReservationService;
        $project = $this->createProject([
            'status' => 'sold',
        ]);

        $this->expectException(ReservationUnavailableException::class);

        $service->createReservation($project, [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ]);
    }

    public function test_it_throws_for_duplicate_reservation_in_same_project(): void
    {
        $service = new ReservationService;
        $project = $this->createProject();

        $service->createReservation($project, [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ]);

        $this->expectException(DuplicateReservationException::class);

        $service->createReservation($project, [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ]);
    }

    private function createProject(array $overrides = []): Project
    {
        return Project::create(array_merge([
            'slug' => 'project-'.uniqid(),
            'name' => 'Test Project',
            'description' => 'Test project description',
            'type' => 'villa',
            'area_sqm' => 200,
            'location' => 'Cairo',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'is_featured' => false,
            'price_starts_at' => '100000',
            'image_url' => 'https://example.com/project.jpg',
            'status' => 'available',
        ], $overrides));
    }
}
