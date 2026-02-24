<?php

use App\Services\DailyReservationsReportService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('reservations:send-daily-report', function (): void {
    app(DailyReservationsReportService::class)->send();
})->purpose('Send yesterday reservations CSV to admins');

Schedule::command('reservations:send-daily-report')->dailyAt('10:00');
