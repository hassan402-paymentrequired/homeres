<?php

use App\Support\Storefront\ChatReplySanitizer;

test('chat reply sanitizer removes leaked tool names', function () {
    $reply = 'Of course! The [get_help_info] function allows us to provide detailed information about various topics.';

    expect(ChatReplySanitizer::sanitize($reply))
        ->not->toContain('get_help_info')
        ->not->toContain('function allows');
});

test('chat reply sanitizer replaces heavily leaked responses with a safe fallback', function () {
    $reply = 'The get_help_info tool allows us to lookup topics. Options include: FAQ, Shipping, Returns.';

    expect(ChatReplySanitizer::sanitize($reply))
        ->toBe(ChatReplySanitizer::fallbackReply());
});
