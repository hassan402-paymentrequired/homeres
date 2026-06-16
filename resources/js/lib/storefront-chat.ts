import type { StorefrontProduct } from '@/types/storefront-product';
import type { ChatMessage } from '@/types/storefront-chat';

function getCsrfToken(): string {
    const meta = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (meta) {
        return meta;
    }

    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

function jsonHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    const token = getCsrfToken();

    if (token) {
        headers['X-CSRF-TOKEN'] = token;
        headers['X-XSRF-TOKEN'] = token;
    }

    return headers;
}

const fetchOptions: RequestInit = {
    credentials: 'same-origin',
};

export type ChatApiResult =
    | { ok: true; reply: string; products: StorefrontProduct[] }
    | { ok: false; message: string };

export async function sendChatMessages(
    messages: ChatMessage[],
): Promise<ChatApiResult> {
    const payload = messages.map((message) => ({
        role: message.role,
        content: message.content,
    }));

    const response = await fetch('/storefront/chat', {
        ...fetchOptions,
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ messages: payload }),
    });

    const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        products?: StorefrontProduct[];
        message?: string;
    };

    if (!response.ok) {
        return {
            ok: false,
            message:
                data.message ??
                'The assistant is unavailable right now. Please try again.',
        };
    }

    return {
        ok: true,
        reply: data.reply ?? '',
        products: data.products ?? [],
    };
}
