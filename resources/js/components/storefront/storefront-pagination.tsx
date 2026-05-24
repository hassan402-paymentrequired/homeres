import { Link } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import type { Paginated } from '@/types/pagination';

type Props<T> = {
    paginator: Paginated<T>;
};

export default function StorefrontPagination<T>({ paginator }: Props<T>) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Catalog pagination"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e8e8e1',
            }}
        >
            <p
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#6b6b6b',
                    margin: 0,
                }}
            >
                Showing {paginator.from ?? 0}–{paginator.to ?? 0} of {paginator.total}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {paginator.prev_page_url ? (
                    <Link
                        href={paginator.prev_page_url}
                        preserveScroll
                        style={paginationButtonStyle(false)}
                    >
                        Previous
                    </Link>
                ) : (
                    <span style={paginationButtonStyle(true)}>Previous</span>
                )}

                <span
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#6b6b6b',
                        padding: '0 8px',
                    }}
                >
                    Page {paginator.current_page} of {paginator.last_page}
                </span>

                {paginator.next_page_url ? (
                    <Link
                        href={paginator.next_page_url}
                        preserveScroll
                        style={paginationButtonStyle(false)}
                    >
                        Next
                    </Link>
                ) : (
                    <span style={paginationButtonStyle(true)}>Next</span>
                )}
            </div>
        </nav>
    );
}

function paginationButtonStyle(disabled: boolean): CSSProperties {
    return {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        padding: '10px 14px',
        border: '1px solid #e8e8e1',
        background: disabled ? '#f5f5f0' : '#ffffff',
        color: disabled ? '#bbb' : '#060606',
        textDecoration: 'none',
        cursor: disabled ? 'default' : 'pointer',
    };
}
