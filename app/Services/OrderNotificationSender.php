<?php

namespace App\Services;

use App\Models\Order;
use App\Models\StoreSetting;
use App\Notifications\AdminNewOrderNotification;
use App\Notifications\CustomerOrderConfirmationNotification;
use Illuminate\Support\Facades\Notification;

class OrderNotificationSender
{
    public function send(Order $order): void
    {
        $order->loadMissing('items');

        Notification::route('mail', $order->customer_email)
            ->notify(new CustomerOrderConfirmationNotification($order));

        $adminEmail = $this->adminRecipient();

        if ($adminEmail !== null) {
            Notification::route('mail', $adminEmail)
                ->notify(new AdminNewOrderNotification($order));
        }
    }

    private function adminRecipient(): ?string
    {
        $settings = StoreSetting::current();
        $contactEmail = trim((string) ($settings->contact_email ?? ''));

        if ($contactEmail !== '') {
            return $contactEmail;
        }

        $configured = config('mail.order_admin');

        if (is_string($configured) && trim($configured) !== '') {
            return trim($configured);
        }

        return null;
    }
}
