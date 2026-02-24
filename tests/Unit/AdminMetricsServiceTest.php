<?php

namespace Tests\Unit;

use App\Models\Contact;
use App\Models\Project;
use App\Models\Reservation;
use App\Services\AdminMetricsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class AdminMetricsServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_builds_daily_charts_for_the_last_seven_days(): void
    {
        Carbon::setTestNow('2026-02-24 12:00:00');

        Carbon::setTestNow(now()->subDays(6));
        $project = Project::create([
            'slug' => 'metrics-project',
            'name' => 'Metrics Project',
            'description' => 'Metrics description',
            'type' => 'villa',
            'area_sqm' => 220,
            'location' => 'Cairo',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'is_featured' => true,
            'price_starts_at' => '250000',
            'image_url' => 'https://example.com/metrics.jpg',
            'status' => 'available',
        ]);

        Carbon::setTestNow('2026-02-24 12:00:00');
        Project::create([
            'slug' => 'metrics-project-2',
            'name' => 'Metrics Project 2',
            'description' => 'Metrics description',
            'type' => 'apartment',
            'area_sqm' => 120,
            'location' => 'Giza',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'is_featured' => false,
            'price_starts_at' => '120000',
            'image_url' => 'https://example.com/metrics-2.jpg',
            'status' => 'sold',
        ]);

        Carbon::setTestNow(now()->subDays(1));
        Reservation::create([
            'project_id' => $project->id,
            'customer_name' => 'Test Customer',
            'customer_email' => 'metrics@example.com',
            'customer_phone' => '01000000001',
        ]);

        Carbon::setTestNow('2026-02-24 12:00:00');
        Contact::create([
            'name' => 'Contact User',
            'email' => 'contact@example.com',
            'phone' => '01000000002',
            'message' => 'Need details',
            'is_read' => false,
        ]);

        $stats = app(AdminMetricsService::class)->getStats();

        $this->assertSame(2, $stats['total_projects']);
        $this->assertSame(1, $stats['featured_projects']);
        $this->assertSame(1, $stats['sold_projects']);
        $this->assertSame(1, $stats['total_reservations']);
        $this->assertSame(1, $stats['unread_messages']);
        $this->assertCount(7, $stats['projects_chart']);
        $this->assertCount(7, $stats['reservations_chart']);
        $this->assertCount(7, $stats['contacts_chart']);
        $this->assertSame(1, $stats['projects_chart'][0]);
        $this->assertSame(1, $stats['projects_chart'][6]);

        Carbon::setTestNow();
    }
}
