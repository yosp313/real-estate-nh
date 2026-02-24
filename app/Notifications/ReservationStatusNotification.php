<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Reservation $reservation,
        public readonly string $status,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $projectName = $this->reservation->project?->name ?? __('messages.project');
        $statusLabel = __('messages.reservation_status_'.$this->status);

        return (new MailMessage)
            ->subject(__('messages.reservation_mail_subject', ['status' => $statusLabel]))
            ->greeting(__('messages.reservation_mail_greeting', ['name' => $this->reservation->customer_name]))
            ->line(__('messages.reservation_mail_project', ['project' => $projectName]))
            ->line(__('messages.reservation_mail_status', ['status' => $statusLabel]))
            ->line(__('messages.reservation_mail_reference', ['id' => $this->reservation->id]))
            ->line(__('messages.reservation_mail_footer'));
    }
}
