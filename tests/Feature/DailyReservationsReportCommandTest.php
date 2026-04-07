<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Reservation;
use App\Models\User;
use App\Notifications\DailyReservationsReportNotification;
use App\Services\DailyReservationsReportService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class DailyReservationsReportCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_sends_yesterday_reservations_csv_to_all_admin_users(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-24 10:00:00'));
        Notification::fake();

        $project = $this->createProject();

        $yesterdayReservation = Reservation::create([
            'project_id' => $project->id,
            'customer_name' => 'Yesterday Reservation',
            'customer_email' => 'yesterday@example.com',
            'customer_phone' => '01000000001',
            'status' => 'pending',
        ]);

        Reservation::query()->whereKey($yesterdayReservation->id)->update([
            'created_at' => now()->subDay()->setTime(9, 30),
            'updated_at' => now()->subDay()->setTime(9, 30),
        ]);

        $oldReservation = Reservation::create([
            'project_id' => $project->id,
            'customer_name' => 'Old Reservation',
            'customer_email' => 'old@example.com',
            'customer_phone' => '01000000002',
            'status' => 'pending',
        ]);

        Reservation::query()->whereKey($oldReservation->id)->update([
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2),
        ]);

        $firstAdmin = User::factory()->create(['email' => 'admin1@example.com']);
        $secondAdmin = User::factory()->create(['email' => 'admin2@example.com']);

        app(DailyReservationsReportService::class)->send();

        Notification::assertSentTo(
            $firstAdmin,
            DailyReservationsReportNotification::class,
            function (DailyReservationsReportNotification $notification): bool {
                return str_contains($notification->csvContent, 'Yesterday Reservation')
                    && ! str_contains($notification->csvContent, 'Old Reservation')
                    && str_contains($notification->csvFilename, 'reservations-2026-02-23.csv');
            }
        );

        Notification::assertSentTo(
            $secondAdmin,
            DailyReservationsReportNotification::class,
            function (DailyReservationsReportNotification $notification): bool {
                return str_contains($notification->csvContent, 'Yesterday Reservation')
                    && ! str_contains($notification->csvContent, 'Old Reservation')
                    && str_contains($notification->csvFilename, 'reservations-2026-02-23.csv');
            }
        );

        Carbon::setTestNow();
    }

    public function test_daily_report_command_is_scheduled_for_9_am(): void
    {
        $events = app(Schedule::class)->events();

        $this->assertTrue(collect($events)->contains(function (object $event): bool {
            return str_contains($event->command, 'reservations:send-daily-report')
                && $event->expression === '0 9 * * *';
        }));
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
