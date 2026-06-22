<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\Project;
use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;

class AdminMetricsService
{
    /**
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        $projectsAgg = Project::query()
            ->selectRaw('COUNT(*) as total, SUM(is_featured) as featured, SUM(status = "sold") as sold')
            ->first();

        $reservationsCount = Reservation::count();
        $unreadMessages = Contact::where('is_read', false)->count();

        return [
            'total_projects' => (int) $projectsAgg->total,
            'featured_projects' => (int) $projectsAgg->featured,
            'sold_projects' => (int) $projectsAgg->sold,
            'total_reservations' => $reservationsCount,
            'unread_messages' => $unreadMessages,
            'projects_chart' => $this->getDailyCounts(Project::class),
            'reservations_chart' => $this->getDailyCounts(Reservation::class),
            'contacts_chart' => $this->getDailyCounts(Contact::class),
        ];
    }

    /**
     * @param  class-string<Model>  $modelClass
     * @return array<int, int>
     */
    public function getDailyCounts(string $modelClass, int $days = 7): array
    {
        $startDate = CarbonImmutable::today()->subDays($days - 1);

        $countsByDay = $modelClass::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as aggregate')
            ->whereDate('created_at', '>=', $startDate)
            ->groupBy('day')
            ->pluck('aggregate', 'day');

        $chart = [];

        for ($index = 0; $index < $days; $index++) {
            $day = $startDate->addDays($index)->toDateString();
            $chart[] = (int) ($countsByDay[$day] ?? 0);
        }

        return $chart;
    }
}