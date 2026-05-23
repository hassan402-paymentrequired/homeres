import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/pagination';

type Props<T> = {
    paginator: Paginated<T>;
};

export default function AdminPagination<T>({ paginator }: Props<T>) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 border-t border-sidebar-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing {paginator.from ?? 0}–{paginator.to ?? 0} of{' '}
                {paginator.total}
            </p>

            <div className="flex items-center gap-2">
                {paginator.prev_page_url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={paginator.prev_page_url} preserveScroll>
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                )}

                <span className="px-2 text-sm text-muted-foreground">
                    Page {paginator.current_page} of {paginator.last_page}
                </span>

                {paginator.next_page_url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={paginator.next_page_url} preserveScroll>
                            Next
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
