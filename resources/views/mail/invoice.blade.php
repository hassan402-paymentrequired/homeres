<x-mail::message>
# Invoice {{ $invoiceData['invoice_number'] }}

Hello {{ $invoiceData['customer_name'] }},

@if ($personalMessage)
{{ $personalMessage }}

@endif
Please find your invoice details below@if (!empty($invoiceData['order_number'])) for order **{{ $invoiceData['order_number'] }}**@endif.

@if (!empty($invoiceData['due_date']))
**Due:** {{ $invoiceData['due_date'] }}
@endif

<x-mail::table>
| Item | Qty | Unit | Total |
|:-----|:---:|-----:|------:|
@foreach ($invoiceData['lines'] as $item)
| **{{ $item['description'] }}** | {{ $item['quantity'] }} | ₦{{ $item['unit_price_display'] }} | ₦{{ $item['line_total_display'] }} |
@endforeach
</x-mail::table>

**Subtotal:** ₦{{ $invoiceData['subtotal_display'] }}  
**Discount:** ₦{{ $invoiceData['discount_display'] }}  
**Tax:** ₦{{ $invoiceData['tax_display'] }}  
@if (!empty($invoiceData['shipping_display']) && $invoiceData['shipping_display'] !== '—' && $invoiceData['shipping_display'] !== '0.00')
**Shipping:** ₦{{ $invoiceData['shipping_display'] }}  
@endif
**Total:** {{ $invoiceData['total_display'] === 'Price on request' ? $invoiceData['total_display'] : '₦'.$invoiceData['total_display'] }}

@if (!empty($invoiceData['customer_note']))
**Notes:**  
{{ $invoiceData['customer_note'] }}
@endif

@if (!empty($invoiceData['payment_instructions']))
**Payment instructions**  
{{ $invoiceData['payment_instructions'] }}
@endif

@if ($contactEmail || $contactPhone)
If you have any questions, please contact us@if ($contactEmail) at [{{ $contactEmail }}](mailto:{{ $contactEmail }})@endif@if ($contactEmail && $contactPhone) or @endif@if ($contactPhone) on {{ $contactPhone }}@endif.
@endif

Thanks,<br>
{{ $storeName }}
</x-mail::message>
