@include('mail.partials.order-lines')

@if ($contactEmail || $contactPhone)
    <p style="margin:24px 0 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#6b6b6b;">
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
