<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\StoreSetting;
use App\Support\OrderMailPresenter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerOrderConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order)
    {
        $this->afterCommit();
    }

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
        $orderData = OrderMailPresenter::present($this->order);

        $orderUrl = $this->order->user_id !== null
            ? route('account.orders.show', $this->order)
            : route('checkout.complete', $this->order);

        return (new MailMessage)
            ->subject("Order confirmation {$this->order->order_number} — ".config('app.name'))
            ->view('mail.order-confirmation', [
                'orderData' => $orderData,
                'orderUrl' => $orderUrl,
                'contactEmail' => $settings->contact_email,
                'contactPhone' => $settings->contact_phone,
            ]);
    }
}
