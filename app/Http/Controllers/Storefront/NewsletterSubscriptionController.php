<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreNewsletterSubscriberRequest;
use App\Models\NewsletterSubscriber;
use App\Support\Storefront\NewsletterPromptResolver;
use Illuminate\Http\JsonResponse;

class NewsletterSubscriptionController extends Controller
{
    public function __invoke(
        StoreNewsletterSubscriberRequest $request,
        NewsletterPromptResolver $prompt,
    ): JsonResponse {
        $email = $request->normalizedEmail();
        $user = $request->user();

        $subscriber = NewsletterSubscriber::query()->firstOrCreate(
            ['email' => $email],
            [
                'source' => $request->source(),
                'subscribed_at' => now(),
                'user_id' => $user?->id,
            ],
        );

        if ($user !== null && $subscriber->user_id === null) {
            $subscriber->update(['user_id' => $user->id]);
        }

        return response()->json([
            'message' => 'Thank you for subscribing!',
            'already_subscribed' => ! $subscriber->wasRecentlyCreated,
        ])->cookie($prompt->subscribedCookie());
    }
}
