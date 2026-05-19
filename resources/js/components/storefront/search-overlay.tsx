import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { MOCK_PRODUCTS } from '@/data/mock-products';

const RECENT_KEY = 'homere-recent-searches';
const SUGGESTED = ['lamp', 'candle', 'vase', 'cushion', 'chandelier'];

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
}

function readRecent(): string[] {
    try {
        const raw = localStorage.getItem(RECENT_KEY);

        return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
        return [];
    }
}

function saveRecent(term: string) {
    const trimmed = term.trim();

    if (!trimmed) {
        return;
    }

    const next = [trimmed, ...readRecent().filter((t) => t !== trimmed)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function SearchOverlay({
    isOpen,
    onClose,
    initialQuery = '',
}: SearchOverlayProps) {
    const [query, setQuery] = useState(initialQuery);
    const [recent, setRecent] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setQuery(initialQuery);
            setRecent(readRecent());
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, initialQuery]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
            return [];
        }

        return MOCK_PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q),
        ).slice(0, 8);
    }, [query]);

    const submit = (term: string) => {
        const t = term.trim();

        if (!t) {
            return;
        }

        saveRecent(t);
        onClose();
        router.visit(`/shop?q=${encodeURIComponent(t)}`);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 300,
                background: 'rgba(6,6,6,0.55)',
                backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#ffffff',
                    maxWidth: '720px',
                    margin: '80px auto 0',
                    padding: '32px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '18px',
                            margin: 0,
                            textTransform: 'uppercase',
                        }}
                    >
                        Search
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close search"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(query);
                    }}
                >
                    <input
                        type="search"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products…"
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: '1px solid #e8e8e1',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            marginBottom: '20px',
                        }}
                    />
                </form>

                {query.trim() === '' && (
                    <>
                        {recent.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <p
                                    style={{
                                        fontSize: '10px',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#999',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Recent
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {recent.map((term) => (
                                        <button
                                            key={term}
                                            type="button"
                                            onClick={() => submit(term)}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid #e8e8e1',
                                                background: '#f5f5f3',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p
                            style={{
                                fontSize: '10px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#999',
                                marginBottom: '8px',
                            }}
                        >
                            Popular
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {SUGGESTED.map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => submit(term)}
                                    style={{
                                        padding: '6px 12px',
                                        border: '1px solid #e8e8e1',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                    }}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {results.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {results.map((p) => (
                            <li
                                key={p.id}
                                style={{ borderBottom: '1px solid #f0f0ec' }}
                            >
                                <Link
                                    href={`/products/${p.id}`}
                                    onClick={onClose}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '12px 0',
                                        textDecoration: 'none',
                                        color: '#060606',
                                    }}
                                >
                                    <img
                                        src={p.images[0]?.src}
                                        alt=""
                                        style={{
                                            width: '48px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            background: '#f5f5f3',
                                        }}
                                    />
                                    <div>
                                        <p
                                            style={{
                                                margin: '0 0 4px',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {p.name}
                                        </p>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                color: '#6b6b6b',
                                            }}
                                        >
                                            {p.priceFormatted}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {query.trim() && results.length === 0 && (
                    <p style={{ color: '#6b6b6b', fontSize: '13px' }}>
                        No products found for &ldquo;{query}&rdquo;
                    </p>
                )}
            </div>
        </div>
    );
}
