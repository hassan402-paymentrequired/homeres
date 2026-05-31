<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', config('app.name'))</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f3;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f3;margin:0;padding:0;width:100%;">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
                    @include('mail.partials.header')

                    <tr>
                        <td style="background-color:#ffffff;border:1px solid #e8e8e1;padding:40px 36px;">
                            @yield('content')
                        </td>
                    </tr>

                    @include('mail.partials.footer')
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
