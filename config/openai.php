<?php

return [

    'api_key' => env('OPENAI_API_KEY', 'sk-proj-1234567890'),

    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),

    'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),

    'max_tool_rounds' => (int) env('OPENAI_MAX_TOOL_ROUNDS', 5),

];
