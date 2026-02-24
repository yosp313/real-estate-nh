<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_projects_by_type_and_area(): void
    {
        $villa = $this->createProject('filtered-villa', 'villa', 220);
        $this->createProject('filtered-studio', 'studio', 60);

        $response = $this->get('/?type=villa&min_area=200');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->where('filters.type', 'villa')
            ->where('filters.min_area', '200')
            ->has('projects', 1)
            ->where('projects.0.slug', $villa->slug)
        );
    }

    public function test_it_ignores_invalid_filter_values_instead_of_failing(): void
    {
        $response = $this->get('/?type=__bad__&min_area=NaN&project=__missing__');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->where('filters.type', null)
            ->where('filters.min_area', null)
            ->where('filters.project', null)
        );
    }

    private function createProject(string $slug, string $type, int $area): Project
    {
        return Project::create([
            'slug' => $slug,
            'name' => 'Project '.$slug,
            'description' => 'Test project description',
            'type' => $type,
            'area_sqm' => $area,
            'location' => 'Cairo',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'is_featured' => false,
            'price_starts_at' => '100000',
            'image_url' => 'https://example.com/project-'.$slug.'.jpg',
        ]);
    }
}
