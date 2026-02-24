<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\DailyReservationsReportNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;

class DailyReservationsReportService
{
    public function __construct(private readonly AdminCsvService $adminCsvService) {}

    public function send(): void
    {
        $reportDate = Carbon::yesterday();
        $csv = $this->adminCsvService->exportReservationsForDate($reportDate);
        $filename = 'reservations-'.$reportDate->toDateString().'.csv';

        $admins = User::query()->get();

        if ($admins->isEmpty()) {
            return;
        }

        Notification::send($admins, new DailyReservationsReportNotification($csv, $filename));
    }
}
