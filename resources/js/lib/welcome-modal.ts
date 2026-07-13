export const WELCOME_STORAGE_KEY = 'homere_welcome_dismissed';

export function hasDismissedWelcome(): boolean {
    if (typeof window === 'undefined') {
        return true;
    }

    try {
        return window.localStorage.getItem(WELCOME_STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

export function markWelcomeDismissed(): void {
    try {
        window.localStorage.setItem(WELCOME_STORAGE_KEY, '1');
    } catch {
        // Ignore private-mode / storage failures; modal may reappear.
    }

    window.dispatchEvent(new Event('homere:welcome-dismissed'));
}
