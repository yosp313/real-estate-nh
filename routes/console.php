<?php

use App\Models\User;
use App\Notifications\DailyReservationsReportNotification;
use App\Services\AdminCsvService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('reservations:send-daily-report', function (AdminCsvService $csvService): void {
    $reportDate = Carbon::yesterday();
    $csv = $csvService->exportReservationsForDate($reportDate);
    $filename = 'reservations-'.$reportDate->toDateString().'.csv';

    $admins = User::query()->get();

    if ($admins->isEmpty()) {
        return;
    }

    Notification::send($admins, new DailyReservationsReportNotification($csv, $filename));
})->purpose('Send yesterday reservations CSV to admins');

Schedule::command('reservations:send-daily-report')->dailyAt('09:00');
