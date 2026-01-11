<?php

namespace App\Filament\Widgets;

use App\Models\Reservation;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class ReservationsChartWidget extends ChartWidget
{
    protected static ?int $sort = 2;

    public function getHeading(): string
    {
        return __('Reservations');
    }

    protected function getData(): array
    {
        $months = collect();
        $counts = collect();

        // Get last 6 months of data
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push($date->format('M Y'));
            $counts->push(
                Reservation::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count()
            );
        }

        return [
            'datasets' => [
                [
                    'label' => __('Reservations'),
                    'data' => $counts->toArray(),
                    'backgroundColor' => 'rgba(201, 160, 80, 0.5)',
                    'borderColor' => '#c9a050',
                ],
            ],
            'labels' => $months->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
