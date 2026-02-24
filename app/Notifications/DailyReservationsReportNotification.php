<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DailyReservationsReportNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $csvContent,
        public readonly string $csvFilename,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Daily reservations report')
            ->line('Attached is the reservations CSV report for yesterday.')
            ->attachData($this->csvContent, $this->csvFilename, ['mime' => 'text/csv']);
    }
}
