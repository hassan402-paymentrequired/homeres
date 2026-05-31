<?php

namespace App\Notifications;

use App\Models\StoreSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $settings = StoreSetting::current();
        $firstName = Str::before(trim($notifiable->name), ' ') ?: $notifiable->name;

        return (new MailMessage)
            ->subject('Welcome to '.config('app.name'))
            ->view('mail.welcome', [
                'firstName' => $firstName,
                'shopUrl' => url('/shop'),
                'contactEmail' => $settings->contact_email,
            ]);
    }
}
