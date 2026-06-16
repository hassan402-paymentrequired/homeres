<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'messages' => ['required', 'array', 'min:1', 'max:24'],
            'messages.*.role' => ['required', Rule::in(['user', 'assistant'])],
            'messages.*.content' => ['required', 'string', 'max:2000'],
        ];
    }

    /**
     * @return list<array{role: string, content: string}>
     */
    public function chatMessages(): array
    {
        return collect($this->input('messages', []))
            ->map(fn (array $message): array => [
                'role' => (string) $message['role'],
                'content' => trim((string) $message['content']),
            ])
            ->filter(fn (array $message): bool => $message['content'] !== '')
            ->values()
            ->all();
    }
}
