import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_PRODUCTS } from '@/data/mock-products';

const RECENT_KEY = 'homere-recent-searches';
const SUGGESTED = ['lamp', 'candle', 'vase', 'cushion', 'chandelier'];

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
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

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [recent, setRecent] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setQuery('');
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setRecent(readRecent());
            document.body.style.overflow = 'hidden';
            const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

            return () => window.clearTimeout(focusTimer);
        }

        setQuery('');
        document.body.style.overflow = '';

        return undefined;
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setQuery('');
                onClose();
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

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
        ).slice(0, 12);
    }, [query]);

    const applySearch = (term: string) => {
        const t = term.trim();

        if (!t) {
            return;
        }

        saveRecent(t);
        setQuery(t);
        setRecent(readRecent());
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="search-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 300,
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <button
                type="button"
                onClick={handleClose}
                aria-label="Close search"
                className="search-overlay-close"
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '28px',
                    lineHeight: 1,
                    color: '#060606',
                    padding: '8px',
                }}
            >
                ×
            </button>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    width: '100%',
                    maxWidth: '720px',
                    margin: '0 auto',
                    padding: '72px 24px 48px',
                    boxSizing: 'border-box',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applySearch(query);
                    }}
                >
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products…"
                        aria-label="Search products"
                        style={{
                            width: '100%',
                            padding: '16px 0',
                            border: 'none',
                            borderBottom: '1px solid #060606',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: 'clamp(18px, 4vw, 24px)',
                            fontWeight: 300,
                            letterSpacing: '0.5px',
                            color: '#060606',
                            background: 'transparent',
                            outline: 'none',
                            boxSizing: 'border-box',
                            marginBottom: '32px',
                        }}
                    />
                </form>

                {query.trim() === '' && (
                    <>
                        {recent.length > 0 && (
                            <div style={{ marginBottom: '28px' }}>
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '10px',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#999',
                                        marginBottom: '12px',
                                    }}
                                >
                                    Recent
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {recent.map((term) => (
                                        <button
                                            key={term}
                                            type="button"
                                            onClick={() => applySearch(term)}
                                            style={{
                                                padding: '8px 14px',
                                                border: '1px solid #e8e8e1',
                                                background: '#f5f5f3',
                                                cursor: 'pointer',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                color: '#060606',
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
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#999',
                                marginBottom: '12px',
                            }}
                        >
                            Popular
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {SUGGESTED.map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => applySearch(term)}
                                    style={{
                                        padding: '8px 14px',
                                        border: '1px solid #e8e8e1',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        color: '#060606',
                                    }}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {query.trim() !== '' && (
                    <>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: '#6b6b6b',
                                margin: '0 0 16px',
                            }}
                        >
                            {results.length > 0
                                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                                : 'No results'}
                        </p>

                        {results.length > 0 ? (
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                {results.map((p) => (
                                    <li
                                        key={p.id}
                                        style={{ borderBottom: '1px solid #f0f0ec' }}
                                    >
                                        <Link
                                            href={`/products/${p.id}`}
                                            onClick={handleClose}
                                            style={{
                                                display: 'flex',
                                                gap: '16px',
                                                padding: '16px 0',
                                                textDecoration: 'none',
                                                color: '#060606',
                                            }}
                                        >
                                            <img
                                                src={p.images[0]?.src}
                                                alt=""
                                                style={{
                                                    width: '56px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    background: '#f5f5f3',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div>
                                                <p
                                                    style={{
                                                        margin: '0 0 6px',
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    {p.name}
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontFamily: 'Poppins, sans-serif',
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
                        ) : (
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    color: '#6b6b6b',
                                    fontSize: '14px',
                                    margin: 0,
                                }}
                            >
                                No products found for &ldquo;{query}&rdquo;
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
