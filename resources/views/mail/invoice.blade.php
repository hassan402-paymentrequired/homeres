@extends('mail.layout')

@section('title', 'Invoice '.$invoiceData['invoice_number'].' — '.config('app.name'))

@section('content')
    <h1 style="margin:0 0 8px;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;color:#060606;letter-spacing:0.02em;">
        Invoice {{ $invoiceData['invoice_number'] }}
    </h1>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Hello {{ $invoiceData['customer_name'] }},
    </p>

    @if ($personalMessage)
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#060606;">
            {{ $personalMessage }}
        </p>
    @endif

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Please find your invoice details below
        @if (!empty($invoiceData['order_number']))
            for order <strong style="color:#060606;font-weight:500;">{{ $invoiceData['order_number'] }}</strong>
        @endif.
    </p>

    @if (!empty($invoiceData['due_date']))
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:400;letter-spacing:0.5px;color:#060606;">
            <strong>Due:</strong> {{ $invoiceData['due_date'] }}
        </p>
    @endif

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;border-collapse:collapse;">
        <thead>
            <tr>
                <th align="left" style="padding:12px 0;border-bottom:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#6b6b6b;">Item</th>
                <th align="center" style="padding:12px 0;border-bottom:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#6b6b6b;">Qty</th>
                <th align="right" style="padding:12px 0;border-bottom:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#6b6b6b;">Unit</th>
                <th align="right" style="padding:12px 0;border-bottom:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#6b6b6b;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoiceData['lines'] as $item)
                <tr>
                    <td style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:400;color:#060606;">{{ $item['description'] }}</td>
                    <td align="center" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;color:#6b6b6b;">{{ $item['quantity'] }}</td>
                    <td align="right" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;color:#6b6b6b;">₦{{ $item['unit_price_display'] }}</td>
                    <td align="right" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:500;color:#060606;">₦{{ $item['line_total_display'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Subtotal</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $invoiceData['subtotal_display'] }}</td>
        </tr>
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Discount</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $invoiceData['discount_display'] }}</td>
        </tr>
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Tax</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $invoiceData['tax_display'] }}</td>
        </tr>
        @if (!empty($invoiceData['shipping_display']) && $invoiceData['shipping_display'] !== '—' && $invoiceData['shipping_display'] !== '0.00')
            <tr>
                <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Shipping</td>
                <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $invoiceData['shipping_display'] }}</td>
            </tr>
        @endif
        <tr>
            <td style="padding:14px 0 0;border-top:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#060606;">Total</td>
            <td align="right" style="padding:14px 0 0;border-top:1px solid #e8e8e1;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:18px;font-weight:600;color:#060606;">
                {{ $invoiceData['total_display'] === 'Price on request' ? $invoiceData['total_display'] : '₦'.$invoiceData['total_display'] }}
            </td>
        </tr>
    </table>

    @if (!empty($invoiceData['customer_note']))
        <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#060606;">Notes</p>
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">{{ $invoiceData['customer_note'] }}</p>
    @endif

    @if (!empty($invoiceData['payment_instructions']))
        <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#060606;">Payment instructions</p>
        <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">{{ $invoiceData['payment_instructions'] }}</p>
    @endif

    @if ($contactEmail || $contactPhone)
        <p style="margin:0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#6b6b6b;">
            If you have any questions, please contact us
            @if ($contactEmail)
                at <a href="mailto:{{ $contactEmail }}" style="color:#060606;text-decoration:underline;">{{ $contactEmail }}</a>
            @endif
            @if ($contactEmail && $contactPhone)
                or
            @endif
            @if ($contactPhone)
                on {{ $contactPhone }}
            @endif.
        </p>
    @endif
@endsection
