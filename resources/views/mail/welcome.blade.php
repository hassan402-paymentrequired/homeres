@extends('mail.layout')

@section('title', 'Welcome to '.config('app.name'))

@section('content')
    <h1 style="margin:0 0 8px;font-family:'Proza Libre',Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;color:#060606;letter-spacing:0.02em;">
        Welcome to {{ config('app.name') }}
    </h1>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Hello {{ $firstName }},
    </p>

    <p style="margin:0 0 24px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Thank you for joining {{ config('app.name') }}. Your account is ready, and we are delighted to welcome you to a world of curated luxury for the home.
    </p>

    <p style="margin:0 0 8px;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:#6b6b6b;">
        Explore our collections of furniture, lighting, fragrance, and design objects — thoughtfully selected to elevate every room.
    </p>

    @include('mail.partials.button', [
        'url' => $shopUrl,
        'label' => 'Start shopping',
    ])

    <p style="margin:24px 0 0;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#999999;">
        We look forward to helping you create a home that reflects your style.
    </p>
@endsection
