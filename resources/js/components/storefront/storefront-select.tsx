import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export type StorefrontSelectOption = {
    value: string;
    label: string;
    keywords?: string;
};

type Props = {
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: StorefrontSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    searchable?: boolean;
    ariaLabel?: string;
    className?: string;
    style?: CSSProperties;
};

const triggerBaseStyle: CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    padding: '10px 12px',
    border: '1px solid #e8e8e1',
    background: '#fff',
    color: '#060606',
    minWidth: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    cursor: 'pointer',
    textAlign: 'left',
};

export default function StorefrontSelect({
    id,
    value,
    onValueChange,
    options,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    emptyMessage = 'No results found.',
    disabled = false,
    searchable,
    ariaLabel,
    className,
    style,
}: Props) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const selected = options.find((option) => option.value === value);
    const showSearch = searchable ?? options.length > 8;

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (normalized === '') {
            return options;
        }

        return options.filter((option) => {
            const haystack = `${option.label} ${option.keywords ?? ''}`.toLowerCase();

            return haystack.includes(normalized);
        });
    }, [options, query]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setQuery('');
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    return (
        <div
            ref={containerRef}
            className={className ? `storefront-select ${className}` : 'storefront-select'}
            style={{
                position: 'relative',
                flex: '1 1 140px',
                maxWidth: '100%',
                minWidth: 0,
                ...style,
            }}
        >
            <button
                id={id}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-label={ariaLabel}
                disabled={disabled}
                style={{
                    ...triggerBaseStyle,
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                onClick={() => {
                    if (!disabled) {
                        setOpen((current) => !current);
                    }
                }}
            >
                <span
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: selected ? '#060606' : '#999',
                    }}
                >
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : undefined,
                        transition: 'transform 0.2s ease',
                    }}
                />
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 60,
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        minWidth: '100%',
                        background: '#ffffff',
                        border: '1px solid #e8e8e1',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {showSearch && (
                        <div
                            style={{
                                padding: '8px',
                                borderBottom: '1px solid #f0f0ec',
                            }}
                        >
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={searchPlaceholder}
                                autoFocus
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #e8e8e1',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    )}

                    <ul
                        id={listId}
                        role="listbox"
                        style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: '4px',
                            maxHeight: '240px',
                            overflowY: 'auto',
                        }}
                    >
                        {filtered.length === 0 ? (
                            <li
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    color: '#999',
                                    padding: '12px 8px',
                                    textAlign: 'center',
                                }}
                            >
                                {emptyMessage}
                            </li>
                        ) : (
                            filtered.map((option) => {
                                const isSelected = option.value === value;

                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 10px',
                                                border: 'none',
                                                background: isSelected
                                                    ? '#f5f5f3'
                                                    : 'transparent',
                                                color: '#060606',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                            onClick={() => {
                                                onValueChange(option.value);
                                                setOpen(false);
                                                setQuery('');
                                            }}
                                        >
                                            <Check
                                                size={14}
                                                strokeWidth={2}
                                                style={{
                                                    flexShrink: 0,
                                                    opacity: isSelected ? 1 : 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {option.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
