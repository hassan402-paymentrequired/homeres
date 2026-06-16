export type NewsletterSource = 'modal' | 'footer';

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

export type NewsletterSubscribeResult = {
    ok: boolean;
    message: string;
    alreadySubscribed?: boolean;
};

export async function subscribeNewsletter(
    email: string,
    source: NewsletterSource,
): Promise<NewsletterSubscribeResult> {
    const response = await fetch('/storefront/newsletter', {
        ...fetchOptions,
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ email, source }),
    });

    const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        already_subscribed?: boolean;
        errors?: { email?: string[] };
    };

    if (!response.ok) {
        const validationMessage = data.errors?.email?.[0];

        return {
            ok: false,
            message: validationMessage ?? 'Something went wrong. Please try again.',
        };
    }

    return {
        ok: true,
        message: data.message ?? 'Thank you for subscribing!',
        alreadySubscribed: data.already_subscribed,
    };
}

export async function deferNewsletterPrompt(): Promise<boolean> {
    const response = await fetch('/storefront/newsletter/seen', {
        ...fetchOptions,
        method: 'POST',
        headers: jsonHeaders(),
    });

    return response.ok;
}

export async function dismissNewsletterPrompt(): Promise<boolean> {
    const response = await fetch('/storefront/newsletter/dismiss', {
        ...fetchOptions,
        method: 'POST',
        headers: jsonHeaders(),
    });

    return response.ok;
}
