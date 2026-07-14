export const SITE_UNLOCKED_EVENT = 'homere:site-unlocked';
export const SHOW_WELCOME_EVENT = 'homere:show-welcome';
export const PENDING_WELCOME_KEY = 'homere_pending_welcome';

export type SiteLockSharedProps = {
    enabled: boolean;
    unlocked: boolean;
};

export function isProtectedStorefrontPath(pathname: string): boolean {
    const path = pathname.split('?')[0] ?? pathname;

    if (path === '/wishlist' || path.startsWith('/wishlist/')) {
        return true;
    }

    if (path === '/shop' || path.startsWith('/shop/')) {
        return true;
    }

    if (path.startsWith('/products/')) {
        return true;
    }

    if (path.startsWith('/collections/')) {
        return true;
    }

    if (path === '/brands' || path.startsWith('/brands/')) {
        return true;
    }

    if (path === '/checkout' || path.startsWith('/checkout/')) {
        return true;
    }

    return false;
}

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

export async function unlockSiteWithPassword(
    password: string,
): Promise<{ ok: boolean; message?: string }> {
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

    const response = await fetch('/site-unlock', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({ password }),
    });

    const data = (await response.json().catch(() => ({}))) as {
        unlocked?: boolean;
        message?: string;
        errors?: { password?: string[] };
    };

    if (!response.ok) {
        return {
            ok: false,
            message:
                data.errors?.password?.[0] ??
                data.message ??
                'The password is incorrect.',
        };
    }

    return { ok: true };
}

export function queueWelcomeAfterUnlock(): void {
    try {
        window.sessionStorage.setItem(PENDING_WELCOME_KEY, '1');
    } catch {
        // Ignore private-mode / storage failures.
    }
}

export function consumeQueuedWelcome(): boolean {
    try {
        if (window.sessionStorage.getItem(PENDING_WELCOME_KEY) !== '1') {
            return false;
        }

        window.sessionStorage.removeItem(PENDING_WELCOME_KEY);

        return true;
    } catch {
        return false;
    }
}

export function notifySiteUnlocked(): void {
    queueWelcomeAfterUnlock();
    window.dispatchEvent(new Event(SITE_UNLOCKED_EVENT));
    window.dispatchEvent(new Event(SHOW_WELCOME_EVENT));
}
