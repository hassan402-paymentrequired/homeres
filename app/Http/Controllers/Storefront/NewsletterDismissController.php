<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Support\Storefront\NewsletterPromptResolver;
use Illuminate\Http\JsonResponse;

class NewsletterDismissController extends Controller
{
    public function __invoke(NewsletterPromptResolver $prompt): JsonResponse
    {
        return response()->json([
            'message' => 'Dismissed',
        ])->cookie($prompt->deferPromptCookie());
    }
}
