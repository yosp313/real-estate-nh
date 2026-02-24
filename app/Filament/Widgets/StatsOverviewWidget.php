<?php

namespace App\Filament\Widgets;

use App\Services\AdminMetricsService;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $stats = app(AdminMetricsService::class)->getStats();

        return [
            Stat::make(__('Total Projects'), $stats['total_projects'])
                ->description(__('Properties listed'))
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary')
                ->chart($stats['projects_chart']),

            Stat::make(__('Featured Projects'), $stats['featured_projects'])
                ->description(__('Premium listings'))
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),

            Stat::make(__('Total Reservations'), $stats['total_reservations'])
                ->description(__('Property inquiries'))
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('success')
                ->chart($stats['reservations_chart']),

            Stat::make(__('Unread Messages'), $stats['unread_messages'])
                ->description(__('Pending responses'))
                ->descriptionIcon('heroicon-m-envelope')
                ->color('danger')
                ->chart($stats['contacts_chart']),

            Stat::make(__('Sold Projects'), $stats['sold_projects'])
                ->description(__('Closed inventory'))
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('gray'),
        ];
    }
}
