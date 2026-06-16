<?php

return [

    'base_url' => env('OLLAMA_BASE_URL', 'http://127.0.0.1:11434'),

    'model' => env('OLLAMA_MODEL', 'qwen2.5:3b'),

    'connect_timeout' => (int) env('OLLAMA_CONNECT_TIMEOUT', 3),

    'timeout' => (int) env('OLLAMA_TIMEOUT', 30),

];
