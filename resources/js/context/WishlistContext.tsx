import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

const STORAGE_KEY = 'homere-wishlist';

interface WishlistContextType {
    ids: string[];
    isWishlisted: (id: string) => boolean;
    toggle: (id: string) => void;
    remove: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function readStorage(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
        return [];
    }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setIds(readStorage());
    }, []);

    const persist = useCallback((next: string[]) => {
        setIds(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }, []);

    const isWishlisted = useCallback(
        (id: string) => ids.includes(id),
        [ids],
    );

    const toggle = useCallback(
        (id: string) => {
            persist(
                ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
            );
        },
        [ids, persist],
    );

    const remove = useCallback(
        (id: string) => {
            persist(ids.filter((i) => i !== id));
        },
        [ids, persist],
    );

    return (
        <WishlistContext.Provider value={{ ids, isWishlisted, toggle, remove }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);

    if (!ctx) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }

    return ctx;
}
