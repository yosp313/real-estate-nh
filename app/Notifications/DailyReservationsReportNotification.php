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
            ->subject(__('messages.daily_report_subject'))
            ->line(__('messages.daily_report_line'))
            ->attachData($this->csvContent, $this->csvFilename, ['mime' => 'text/csv']);
    }
}