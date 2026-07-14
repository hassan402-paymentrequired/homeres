import { router, usePage } from '@inertiajs/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    isProtectedStorefrontPath,
    notifySiteUnlocked,
    SITE_UNLOCKED_EVENT,
    type SiteLockSharedProps,
} from '@/lib/site-lock';

type SiteLockContextValue = {
    enabled: boolean;
    unlocked: boolean;
    isLocked: boolean;
    modalOpen: boolean;
    requestAccess: (pendingUrl?: string | null) => void;
    closeModal: () => void;
    markUnlocked: () => void;
};

const SiteLockContext = createContext<SiteLockContextValue | null>(null);

export function useSiteLock(): SiteLockContextValue {
    const value = useContext(SiteLockContext);

    if (!value) {
        throw new Error('useSiteLock must be used within SiteLockProvider');
    }

    return value;
}

export function useOptionalSiteLock(): SiteLockContextValue | null {
    return useContext(SiteLockContext);
}

export function SiteLockProvider({ children }: { children: ReactNode }) {
    const page = usePage<{
        siteLock: SiteLockSharedProps;
    }>();
    const shared = page.props.siteLock ?? { enabled: false, unlocked: true };
    const [unlocked, setUnlocked] = useState(shared.unlocked);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    useEffect(() => {
        if (shared.unlocked) {
            setUnlocked(true);
        }
    }, [shared.unlocked]);

    const isLocked = shared.enabled && !unlocked;

    const requestAccess = useCallback((url?: string | null) => {
        setPendingUrl(url ?? null);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setPendingUrl(null);
    }, []);

    const markUnlocked = useCallback(() => {
        setUnlocked(true);
        setModalOpen(false);
        notifySiteUnlocked();

        const nextUrl = pendingUrl;
        setPendingUrl(null);

        if (nextUrl) {
            router.visit(nextUrl);
        }
    }, [pendingUrl]);

    useEffect(() => {
        const onUnlocked = () => setUnlocked(true);

        window.addEventListener(SITE_UNLOCKED_EVENT, onUnlocked);

        return () => window.removeEventListener(SITE_UNLOCKED_EVENT, onUnlocked);
    }, []);

    useEffect(() => {
        if (!isLocked) {
            return undefined;
        }

        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0) {
                return;
            }

            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const anchor = target.closest('a');

            if (!anchor || !(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
                return;
            }

            const href = anchor.getAttribute('href');

            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            let pathname = href;

            try {
                const url = new URL(href, window.location.origin);

                if (url.origin !== window.location.origin) {
                    return;
                }

                pathname = url.pathname;
            } catch {
                return;
            }

            if (!isProtectedStorefrontPath(pathname)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            requestAccess(href);
        };

        document.addEventListener('click', onClick, true);

        return () => document.removeEventListener('click', onClick, true);
    }, [isLocked, requestAccess]);

    const value = useMemo(
        () => ({
            enabled: shared.enabled,
            unlocked,
            isLocked,
            modalOpen,
            requestAccess,
            closeModal,
            markUnlocked,
        }),
        [
            shared.enabled,
            unlocked,
            isLocked,
            modalOpen,
            requestAccess,
            closeModal,
            markUnlocked,
        ],
    );

    return (
        <SiteLockContext.Provider value={value}>
            {children}
        </SiteLockContext.Provider>
    );
}
