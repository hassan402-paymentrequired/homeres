<tr>
    <td align="center" style="padding:28px 12px 0;">
        <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;color:#999999;">
            {{ config('app.name') }}
        </p>
        <p style="margin:0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#6b6b6b;">
            @if (!empty($contactEmail))
                Questions? <a href="mailto:{{ $contactEmail }}" style="color:#060606;text-decoration:underline;">{{ $contactEmail }}</a>
            @else
                Curated luxury for the home.
            @endif
        </p>
        <p style="margin:12px 0 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:300;color:#999999;">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
    </td>
</tr>
