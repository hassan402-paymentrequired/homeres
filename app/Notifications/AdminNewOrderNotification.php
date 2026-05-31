<?php

namespace App\Notifications;

use App\Models\Order;
use App\Support\OrderMailPresenter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminNewOrderNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject("New order {$this->order->order_number} — {$this->order->customer_name}")
            ->view('mail.order-admin', [
                'orderData' => OrderMailPresenter::present($this->order),
                'adminOrderUrl' => route('admin.orders.show', $this->order),
            ]);
    }
}
