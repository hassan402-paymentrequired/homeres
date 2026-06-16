<?php

namespace App\Http\Responses;

use App\Support\Storefront\NewsletterPromptResolver;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * @param  Request  $request
     */
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user !== null) {
            app(NewsletterPromptResolver::class)->linkSubscriberToUser($user);
        }

        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        return redirect()->intended(route('home'));
    }
}
