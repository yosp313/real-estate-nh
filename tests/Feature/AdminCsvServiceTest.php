<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Services\AdminCsvService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCsvServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_exports_projects_as_csv(): void
    {
        Project::create([
            'slug' => 'csv-project',
            'name' => 'CSV Project',
            'description' => 'Export me',
            'type' => 'villa',
            'area_sqm' => 180,
            'location' => 'Cairo',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'is_featured' => true,
            'price_starts_at' => '350000',
            'image_url' => 'https://example.com/csv-project.jpg',
            'status' => 'available',
        ]);

        $csv = app(AdminCsvService::class)->exportProjects();

        $this->assertStringContainsString('slug,name,description,type,area_sqm,location,bedrooms,bathrooms,is_featured,price_starts_at,image_url,status', $csv);
        $this->assertStringContainsString('csv-project,"CSV Project"', $csv);
    }

    public function test_it_imports_projects_from_csv(): void
    {
        Storage::fake('local');

        $contents = implode("\n", [
            'slug,name,description,type,area_sqm,location,bedrooms,bathrooms,is_featured,price_starts_at,image_url,status',
            'import-project,Imported Project,Imported description,villa,200,Cairo,3,2,1,400000,https://example.com/import.jpg,available',
        ]);

        Storage::disk('local')->put('imports/projects.csv', $contents);

        $count = app(AdminCsvService::class)->importProjects(Storage::disk('local')->path('imports/projects.csv'));

        $this->assertSame(1, $count);
        $this->assertDatabaseHas('projects', [
            'slug' => 'import-project',
            'name' => 'Imported Project',
            'status' => 'available',
        ]);
    }

    public function test_it_imports_contacts_from_csv(): void
    {
        Storage::fake('local');

        $contents = implode("\n", [
            'name,email,phone,message,is_read',
            'CSV Contact,csv-contact@example.com,01000000003,Please call me,0',
        ]);

        Storage::disk('local')->put('imports/contacts.csv', $contents);

        $count = app(AdminCsvService::class)->importContacts(Storage::disk('local')->path('imports/contacts.csv'));

        $this->assertSame(1, $count);
        $this->assertDatabaseHas('contacts', [
            'email' => 'csv-contact@example.com',
            'is_read' => false,
        ]);
    }
}
