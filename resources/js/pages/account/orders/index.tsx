import { Head, Link } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { formatNaira } from '@/lib/cart';
import type { Paginated } from '@/types/pagination';

type OrderSummary = {
    id: string;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    items_count: number;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    placed_at: string;
};

type Props = {
    orders: Paginated<OrderSummary>;
};

function formatPlacedAt(iso: string): string {
    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatTotal(order: OrderSummary): string {
    if (order.has_price_on_request_items && order.total === null) {
        return 'Price on request';
    }

    if (order.total === null) {
        return '—';
    }

    return formatNaira(order.total);
}

export default function AccountOrdersIndex({ orders }: Props) {
    const items = orders.data;

    return (
        <StorefrontShell>
            <Head title="Order history" />

            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '48px 24px 80px',
                }}
            >
                <div style={{ marginBottom: '40px' }}>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            fontWeight: 400,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: '#999',
                            margin: '0 0 12px',
                        }}
                    >
                        Account
                    </p>
                    <h1
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '28px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: '0 0 8px',
                            letterSpacing: '0.02em',
                        }}
                    >
                        Order history
                    </h1>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: '#6b6b6b',
                            margin: 0,
                        }}
                    >
                        View and track your past orders
                    </p>
                </div>

                {items.length === 0 ? (
                    <div
                        style={{
                            border: '1px solid #e8e8e1',
                            padding: '48px 24px',
                            textAlign: 'center',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: '18px',
                                color: '#060606',
                                margin: '0 0 8px',
                            }}
                        >
                            No orders yet
                        </p>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                margin: '0 0 24px',
                            }}
                        >
                            When you place an order while signed in, it will appear
                            here.
                        </p>
                        <Link
                            href="/shop"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 400,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: '#060606',
                                textDecoration: 'none',
                            }}
                        >
                            Continue shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {items.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                style={{
                                    display: 'block',
                                    border: '1px solid #e8e8e1',
                                    padding: '20px 24px',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'border-color 0.2s ease',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontFamily: '"Proza Libre", sans-serif',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                color: '#060606',
                                            }}
                                        >
                                            {order.order_number}
                                        </p>
                                        <p
                                            style={{
                                                margin: '6px 0 0',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                fontWeight: 300,
                                                color: '#6b6b6b',
                                            }}
                                        >
                                            {formatPlacedAt(order.placed_at)} ·{' '}
                                            {order.items_count}{' '}
                                            {order.items_count === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                                color: '#060606',
                                            }}
                                        >
                                            {formatTotal(order)}
                                        </p>
                                        <p
                                            style={{
                                                margin: '6px 0 0',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '10px',
                                                fontWeight: 400,
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                color: '#6b6b6b',
                                            }}
                                        >
                                            {order.status_label}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {orders.last_page > 1 && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    marginTop: '16px',
                                }}
                            >
                                {orders.prev_page_url && (
                                    <Link
                                        href={orders.prev_page_url}
                                        style={paginationLinkStyle}
                                    >
                                        Previous
                                    </Link>
                                )}
                                {orders.next_page_url && (
                                    <Link
                                        href={orders.next_page_url}
                                        style={paginationLinkStyle}
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </StorefrontShell>
    );
}

const paginationLinkStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#060606',
    textDecoration: 'none',
};
