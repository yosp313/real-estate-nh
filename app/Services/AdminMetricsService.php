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
        return [
            'total_projects' => Project::count(),
            'featured_projects' => Project::where('is_featured', true)->count(),
            'sold_projects' => Project::where('status', 'sold')->count(),
            'total_reservations' => Reservation::count(),
            'unread_messages' => Contact::where('is_read', false)->count(),
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
