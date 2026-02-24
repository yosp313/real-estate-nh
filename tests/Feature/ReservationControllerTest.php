<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_reservation(): void
    {
        $project = $this->createProject();

        $response = $this->post(route('project.reserve', $project), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01000000000',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', __('messages.registration_success'));

        $this->assertDatabaseHas('reservations', [
            'project_id' => $project->id,
            'customer_email' => 'john@example.com',
        ]);
    }

    public function test_it_blocks_duplicate_reservations_per_project(): void
    {
        $project = $this->createProject();

        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '01000000000',
        ];

        $this->post(route('project.reserve', $project), $payload)->assertRedirect();

        $secondResponse = $this->post(route('project.reserve', $project), $payload);

        $secondResponse->assertRedirect();
        $secondResponse->assertSessionHasErrors(['email' => __('messages.already_registered')]);
        $this->assertDatabaseCount('reservations', 1);
    }

    public function test_it_blocks_reservations_for_unavailable_projects(): void
    {
        $project = $this->createProject([
            'slug' => 'sold-project',
            'status' => 'sold',
        ]);

        $response = $this->post(route('project.reserve', $project), [
            'name' => 'John Doe',
            'email' => 'sold@example.com',
            'phone' => '01000000000',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['project' => __('messages.project_unavailable')]);
        $this->assertDatabaseCount('reservations', 0);
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
