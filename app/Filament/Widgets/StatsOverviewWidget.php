<?php

namespace App\Filament\Widgets;

use App\Models\Contact;
use App\Models\Project;
use App\Models\Reservation;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make(__('Total Projects'), Project::count())
                ->description(__('Properties listed'))
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary')
                ->chart([7, 3, 4, 5, 6, 3, 5, 8]),

            Stat::make(__('Featured Projects'), Project::where('is_featured', true)->count())
                ->description(__('Premium listings'))
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),

            Stat::make(__('Total Reservations'), Reservation::count())
                ->description(__('Property inquiries'))
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('success')
                ->chart([3, 5, 2, 8, 4, 6, 9, 7]),

            Stat::make(__('Unread Messages'), Contact::where('is_read', false)->count())
                ->description(__('Pending responses'))
                ->descriptionIcon('heroicon-m-envelope')
                ->color('danger'),
        ];
    }
}
