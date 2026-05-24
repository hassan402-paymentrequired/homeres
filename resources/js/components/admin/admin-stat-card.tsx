import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    href?: string;
    hint?: string;
};

const MAX_VALUE_PX = 30;
const MIN_VALUE_PX = 13;

function FittingStatValue({ value }: { value: string | number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const display =
        typeof value === 'number'
            ? value.toLocaleString('en-NG')
            : String(value);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) {
            return;
        }

        const fit = () => {
            text.style.fontSize = '';
            text.style.whiteSpace = 'nowrap';
            text.style.wordBreak = '';

            let size = MAX_VALUE_PX;
            text.style.fontSize = `${size}px`;

            while (text.scrollWidth > container.clientWidth && size > MIN_VALUE_PX) {
                size -= 1;
                text.style.fontSize = `${size}px`;
            }

            if (text.scrollWidth > container.clientWidth) {
                text.style.whiteSpace = 'normal';
                text.style.wordBreak = 'break-word';
                text.style.fontSize = `${MIN_VALUE_PX}px`;
            }
        };

        fit();

        const observer = new ResizeObserver(fit);
        observer.observe(container);

        return () => observer.disconnect();
    }, [display]);

    return (
        <div
            ref={containerRef}
            className="mt-2 min-w-0 w-full max-w-full overflow-hidden"
        >
            <p
                ref={textRef}
                className="font-serif font-medium leading-tight tabular-nums"
                style={{ fontSize: `${MAX_VALUE_PX}px` }}
            >
                {display}
            </p>
        </div>
    );
}

export default function AdminStatCard({
    label,
    value,
    icon: Icon,
    href,
    hint,
}: Props) {
    const content = (
        <>
            <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-muted/40">
                    <Icon className="size-5" />
                </div>
                {href ? (
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                ) : null}
            </div>
            <p className="mt-4 line-clamp-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {label}
            </p>
            <FittingStatValue value={value} />
            {hint ? (
                <p className="mt-1 line-clamp-2 min-w-0 text-xs leading-snug break-words text-muted-foreground [overflow-wrap:anywhere]">
                    {hint}
                </p>
            ) : null}
        </>
    );

    const className = cn(
        'group @container/stat-card min-w-0 rounded-xl border border-sidebar-border/70 bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm',
    );

    if (href) {
        return (
            <Link href={href} prefetch className={className}>
                {content}
            </Link>
        );
    }

    return <div className={className}>{content}</div>;
}
