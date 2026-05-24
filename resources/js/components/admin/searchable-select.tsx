import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchableSelectOption = {
    value: string;
    label: string;
    keywords?: string;
};

type Props = {
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SearchableSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
};

export default function SearchableSelect({
    id,
    value,
    onValueChange,
    options,
    placeholder = 'Select an option…',
    searchPlaceholder = 'Search…',
    emptyMessage = 'No results found.',
    disabled = false,
    className,
}: Props) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const selected = options.find((option) => option.value === value);

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

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <Button
                id={id}
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                disabled={disabled}
                className="h-9 w-full justify-between font-normal"
                onClick={() => setOpen((current) => !current)}
            >
                <span
                    className={cn(
                        'truncate',
                        !selected && 'text-muted-foreground',
                    )}
                >
                    {selected?.label ?? placeholder}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-sidebar-border/70 bg-popover shadow-md">
                    <div className="border-b border-sidebar-border/70 p-2">
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="h-8"
                        />
                    </div>

                    <ul
                        id={listId}
                        role="listbox"
                        className="max-h-60 overflow-y-auto p-1"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </li>
                        ) : (
                            filtered.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={option.value === value}
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                                            option.value === value &&
                                                'bg-accent text-accent-foreground',
                                        )}
                                        onClick={() => {
                                            onValueChange(option.value);
                                            setOpen(false);
                                            setQuery('');
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'size-4 shrink-0',
                                                option.value === value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        <span className="truncate">
                                            {option.label}
                                        </span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
