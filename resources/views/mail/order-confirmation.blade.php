@extends('mail.layout')

@section('title', 'Order confirmation '.$orderData['order_number'].' — '.config('app.name'))

@section('content')
    <h1 style="margin:0 0 8px;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;color:#060606;letter-spacing:0.02em;">
        Thank you for your order
    </h1>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Hello {{ $orderData['customer_name'] }},
    </p>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        We have received your order <strong style="color:#060606;font-weight:500;">{{ $orderData['order_number'] }}</strong>
        placed on {{ $orderData['placed_at'] }}. Payment status: <strong style="color:#060606;font-weight:500;">{{ $orderData['payment_status_label'] }}</strong>.
    </p>

    @include('mail.partials.order-lines')

    @if ($orderData['shipping_address'] || $orderData['shipping_city'] || $orderData['shipping_state'])
        <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#060606;">Shipping to</p>
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
            @if ($orderData['shipping_address'])
                {{ $orderData['shipping_address'] }}<br>
            @endif
            @if ($orderData['shipping_city'] || $orderData['shipping_state'])
                {{ trim(($orderData['shipping_city'] ?? '').', '.($orderData['shipping_state'] ?? ''), ', ') }}<br>
            @endif
            @if ($orderData['customer_phone'])
                {{ $orderData['customer_phone'] }}
            @endif
        </p>
    @endif

    @include('mail.partials.button', [
        'url' => $orderUrl,
        'label' => 'View order',
    ])

    @include('mail.partials.order-contact')
@endsection
