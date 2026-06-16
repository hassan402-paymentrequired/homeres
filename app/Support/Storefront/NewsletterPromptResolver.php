<?php

namespace App\Support\Storefront;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;

final class NewsletterPromptResolver
{
    public const PROMPT_INTERVAL_SECONDS = 60 * 60 * 3;

    public const SUBSCRIBED_COOKIE = 'newsletter_subscribed';

    public const NEXT_PROMPT_COOKIE = 'newsletter_next_prompt_at';

    public function shouldShow(Request $request): bool
    {
        return ! $this->isSuppressedForRequest($request);
    }

    public function isSuppressedForRequest(Request $request): bool
    {
        if ($request->cookie(self::SUBSCRIBED_COOKIE) === '1') {
            return true;
        }

        $user = $request->user();

        if ($user instanceof User && $this->isSubscribedEmail($user->email)) {
            return true;
        }

        $nextPromptAt = (int) $request->cookie(self::NEXT_PROMPT_COOKIE, 0);

        if ($nextPromptAt > now()->timestamp) {
            return true;
        }

        return false;
    }

    public function isSubscribedEmail(string $email): bool
    {
        return NewsletterSubscriber::query()
            ->where('email', NewsletterSubscriber::normalizeEmail($email))
            ->exists();
    }

    public function linkSubscriberToUser(User $user): void
    {
        NewsletterSubscriber::query()
            ->where('email', NewsletterSubscriber::normalizeEmail($user->email))
            ->whereNull('user_id')
            ->update(['user_id' => $user->id]);
    }

    public function subscribedCookie(): Cookie
    {
        return cookie(
            self::SUBSCRIBED_COOKIE,
            '1',
            60 * 24 * 365 * 5,
            '/',
            null,
            null,
            false,
            false,
            Cookie::SAMESITE_LAX,
        );
    }

    public function deferPromptCookie(): Cookie
    {
        $nextPromptAt = now()->addSeconds(self::PROMPT_INTERVAL_SECONDS)->timestamp;

        return cookie(
            self::NEXT_PROMPT_COOKIE,
            (string) $nextPromptAt,
            60 * 24 * 365 * 5,
            '/',
            null,
            null,
            false,
            false,
            Cookie::SAMESITE_LAX,
        );
    }
}
