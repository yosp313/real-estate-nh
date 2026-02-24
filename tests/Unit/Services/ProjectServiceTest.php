<?php

namespace Tests\Unit\Services;

use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_builds_filtered_index_data(): void
    {
        $service = new ProjectService;

        $matchingProject = $this->createProject('villa-prime', 'villa', 220);
        $this->createProject('studio-lite', 'studio', 60);

        $data = $service->getIndexData([
            'type' => 'villa',
            'min_area' => '200',
        ]);

        $this->assertSame('villa', $data['filters']['type']);
        $this->assertSame('200', $data['filters']['min_area']);
        $this->assertNull($data['filters']['project']);
        $this->assertCount(1, $data['projects']);
        $this->assertSame($matchingProject->slug, $data['projects'][0]['slug']);
    }

    public function test_it_ignores_invalid_filter_values(): void
    {
        $service = new ProjectService;

        $data = $service->getIndexData([
            'type' => '__bad__',
            'min_area' => 'NaN',
            'project' => '__missing__',
        ]);

        $this->assertNull($data['filters']['type']);
        $this->assertNull($data['filters']['min_area']);
        $this->assertNull($data['filters']['project']);
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
