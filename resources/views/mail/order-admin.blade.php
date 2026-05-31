@extends('mail.layout')

@section('title', 'New order '.$orderData['order_number'].' — '.config('app.name'))

@section('content')
    <h1 style="margin:0 0 8px;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;color:#060606;letter-spacing:0.02em;">
        New order received
    </h1>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Order <strong style="color:#060606;font-weight:500;">{{ $orderData['order_number'] }}</strong>
        was placed on {{ $orderData['placed_at'] }}.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Customer</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">{{ $orderData['customer_name'] }}</td>
        </tr>
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Email</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">
                <a href="mailto:{{ $orderData['customer_email'] }}" style="color:#060606;text-decoration:underline;">{{ $orderData['customer_email'] }}</a>
            </td>
        </tr>
        @if ($orderData['customer_phone'])
            <tr>
                <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Phone</td>
                <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">{{ $orderData['customer_phone'] }}</td>
            </tr>
        @endif
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Payment</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">{{ $orderData['payment_status_label'] }}</td>
        </tr>
    </table>

    @include('mail.partials.order-lines')

    @if ($orderData['shipping_address'] || $orderData['shipping_city'] || $orderData['shipping_state'])
        <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#060606;">Shipping address</p>
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
            @if ($orderData['shipping_address'])
                {{ $orderData['shipping_address'] }}<br>
            @endif
            @if ($orderData['shipping_city'] || $orderData['shipping_state'])
                {{ trim(($orderData['shipping_city'] ?? '').', '.($orderData['shipping_state'] ?? ''), ', ') }}
            @endif
        </p>
    @endif

    @include('mail.partials.button', [
        'url' => $adminOrderUrl,
        'label' => 'View in admin',
    ])
@endsection
