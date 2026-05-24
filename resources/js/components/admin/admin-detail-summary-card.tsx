import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    children: ReactNode;
    className?: string;
};

export default function AdminDetailSummaryCard({
    title,
    children,
    className,
}: Props) {
    return (
        <div
            className={cn(
                'rounded-xl border border-sidebar-border/70 bg-card p-4',
                className,
            )}
        >
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {title}
            </h2>
            <div className="mt-3 text-sm">{children}</div>
        </div>
    );
}

export function AdminDetailSection({
    title,
    children,
    className,
}: {
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                'overflow-hidden rounded-xl border border-sidebar-border/70',
                className,
            )}
        >
            <div className="border-b border-sidebar-border/70 bg-muted/30 px-4 py-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                    {title}
                </h2>
            </div>
            {children}
        </section>
    );
}
