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
        @foreach ($orderData['lines'] as $item)
            <tr>
                <td style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:400;color:#060606;">{{ $item['description'] }}</td>
                <td align="center" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;color:#6b6b6b;">{{ $item['quantity'] }}</td>
                <td align="right" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;color:#6b6b6b;">
                    @if ($item['unit_price_display'] === 'Price on request')
                        {{ $item['unit_price_display'] }}
                    @else
                        ₦{{ $item['unit_price_display'] }}
                    @endif
                </td>
                <td align="right" style="padding:14px 0;border-bottom:1px solid #f0f0ec;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:500;color:#060606;">
                    @if ($item['line_total_display'] === 'Price on request')
                        {{ $item['line_total_display'] }}
                    @else
                        ₦{{ $item['line_total_display'] }}
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
    @if ($orderData['subtotal_display'] !== '—' && $orderData['subtotal_display'] !== 'Price on request')
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Subtotal</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $orderData['subtotal_display'] }}</td>
        </tr>
    @endif
    @if (!empty($orderData['shipping_display']) && $orderData['shipping_display'] !== '—' && $orderData['shipping_display'] !== '0.00')
        <tr>
            <td style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#6b6b6b;">Shipping</td>
            <td align="right" style="padding:6px 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#060606;">₦{{ $orderData['shipping_display'] }}</td>
        </tr>
    @endif
    <tr>
        <td style="padding:14px 0 0;border-top:1px solid #e8e8e1;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#060606;">Total</td>
        <td align="right" style="padding:14px 0 0;border-top:1px solid #e8e8e1;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:18px;font-weight:600;color:#060606;">
            {{ $orderData['total_display'] === 'Price on request' ? $orderData['total_display'] : '₦'.$orderData['total_display'] }}
        </td>
    </tr>
</table>

@if (!empty($orderData['customer_note']))
    <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#060606;">Customer note</p>
    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">{{ $orderData['customer_note'] }}</p>
@endif
