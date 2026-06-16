<?php

namespace App\Support\Storefront;

final class ChatReplySanitizer
{
    /**
     * @var list<string>
     */
    private const TOOL_NAMES = [
        'search_products',
        'get_product',
        'get_help_info',
    ];

    /**
     * @var list<string>
     */
    private const LEAK_PHRASES = [
        'function allows',
        'tool allows',
        'internal tool',
        'internal function',
        'underlying functionality',
        'api endpoint',
        'tool_call',
        'which topic would you like',
        'options include: faq',
    ];

    public static function sanitize(string $reply): string
    {
        $sanitized = trim($reply);

        if ($sanitized === '') {
            return self::fallbackReply();
        }

        foreach (self::TOOL_NAMES as $name) {
            $sanitized = (string) preg_replace(
                '/\[\s*'.preg_quote($name, '/').'\s*\]/i',
                '',
                $sanitized,
            );
            $sanitized = (string) preg_replace(
                '/\b'.preg_quote($name, '/').'\b/i',
                '',
                $sanitized,
            );
        }

        $sanitized = (string) preg_replace('/\s{2,}/', ' ', $sanitized);
        $sanitized = (string) preg_replace('/\s+([,.!?])/', '$1', $sanitized);
        $sanitized = trim($sanitized);

        if (self::looksLikeInternalLeak($sanitized)) {
            return self::fallbackReply();
        }

        return $sanitized !== '' ? $sanitized : self::fallbackReply();
    }

    private static function looksLikeInternalLeak(string $reply): bool
    {
        $lower = strtolower($reply);

        foreach (self::TOOL_NAMES as $name) {
            if (str_contains($lower, strtolower($name))) {
                return true;
            }
        }

        foreach (self::LEAK_PHRASES as $phrase) {
            if (str_contains($lower, $phrase)) {
                return true;
            }
        }

        if (preg_match('/\b(function|tool|api)\b/i', $reply) && preg_match('/\b(provide|allows|lookup|search)\b/i', $reply)) {
            return true;
        }

        return false;
    }

    public static function fallbackReply(): string
    {
        return 'I can help you find products, answer questions about shipping and returns, share our showroom details, or guide you around the site. What would you like to know?';
    }
}
