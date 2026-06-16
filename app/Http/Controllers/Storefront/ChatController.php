<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreChatRequest;
use App\Services\Storefront\OpenAiChatService;
use Illuminate\Http\JsonResponse;
use RuntimeException;
use Throwable;

class ChatController extends Controller
{
    public function __invoke(StoreChatRequest $request, OpenAiChatService $chat): JsonResponse
    {
        if (! OpenAiChatService::isConfigured()) {
            return response()->json([
                'message' => 'AI assistant is not available right now.',
            ], 503);
        }

        try {
            $result = $chat->chat($request->chatMessages());
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 503);
        } catch (Throwable) {
            return response()->json([
                'message' => 'Something went wrong. Please try again.',
            ], 500);
        }

        return response()->json([
            'reply' => $result['reply'],
            'products' => $result['products'],
        ]);
    }
}
