<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Support\AdminPagination;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(): Response
    {
        $subscribers = NewsletterSubscriber::query()
            ->recent()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (NewsletterSubscriber $subscriber): array => [
                'id' => $subscriber->id,
                'email' => $subscriber->email,
                'source' => $subscriber->source,
                'subscribed_at' => $subscriber->subscribed_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/newsletter-subscribers/index', [
            'subscribers' => $subscribers,
            'stats' => [
                'total' => NewsletterSubscriber::query()->count(),
                'from_modal' => NewsletterSubscriber::query()->where('source', 'modal')->count(),
                'from_footer' => NewsletterSubscriber::query()->where('source', 'footer')->count(),
            ],
        ]);
    }
}
