import { Head, Link } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { formatNaira } from '@/lib/cart';

type OrderItem = {
    id: string;
    product_name: string;
    variant_name: string;
    sku: string | null;
    unit_price: number | null;
    price_on_request: boolean;
    quantity: number;
    line_total: number | null;
};

type OrderRecord = {
    id: string;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
    customer_note: string | null;
    subtotal: number | null;
    shipping_total: number | null;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    placed_at: string;
    items: OrderItem[];
};

type Props = {
    order: OrderRecord;
};

function formatPlacedAt(iso: string): string {
    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

function formatMoney(amount: number | null, priceOnRequest: boolean): string {
    if (priceOnRequest || amount === null) {
        return 'Price on request';
    }

    return formatNaira(amount);
}

export default function AccountOrderShow({ order }: Props) {
    const totalLabel =
        order.has_price_on_request_items || order.total === null
            ? 'Price on request'
            : formatNaira(order.total);

    return (
        <StorefrontShell>
            <Head title={`Order ${order.order_number}`} />

            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '48px 24px 80px',
                }}
            >
                <Link
                    href="/account/orders"
                    style={{
                        display: 'inline-block',
                        marginBottom: '32px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        fontWeight: 400,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: '#6b6b6b',
                        textDecoration: 'none',
                    }}
                >
                    ← Back to order history
                </Link>

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
                        Order
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
                        {order.order_number}
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
                        Placed {formatPlacedAt(order.placed_at)}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px',
                        marginBottom: '40px',
                    }}
                >
                    <div>
                        <p style={metaLabelStyle}>Status</p>
                        <p style={metaValueStyle}>{order.status_label}</p>
                    </div>
                    <div>
                        <p style={metaLabelStyle}>Payment</p>
                        <p style={metaValueStyle}>{order.payment_status_label}</p>
                    </div>
                    <div>
                        <p style={metaLabelStyle}>Total</p>
                        <p style={metaValueStyle}>{totalLabel}</p>
                    </div>
                </div>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={sectionTitleStyle}>Items</h2>
                    <div style={{ borderTop: '1px solid #e8e8e1' }}>
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    padding: '20px 0',
                                    borderBottom: '1px solid #e8e8e1',
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontFamily: '"Proza Libre", sans-serif',
                                            fontSize: '15px',
                                            color: '#060606',
                                        }}
                                    >
                                        {item.product_name}
                                    </p>
                                    <p
                                        style={{
                                            margin: '4px 0 0',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 300,
                                            color: '#6b6b6b',
                                        }}
                                    >
                                        {item.variant_name}
                                        {item.sku ? ` · ${item.sku}` : ''}
                                    </p>
                                    <p
                                        style={{
                                            margin: '4px 0 0',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 300,
                                            color: '#6b6b6b',
                                        }}
                                    >
                                        Qty {item.quantity}
                                    </p>
                                </div>
                                <p
                                    style={{
                                        margin: 0,
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#060606',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {formatMoney(
                                        item.line_total,
                                        item.price_on_request,
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 style={sectionTitleStyle}>Shipping</h2>
                    <div
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: '#444',
                            lineHeight: 1.7,
                        }}
                    >
                        <p style={{ margin: '0 0 4px' }}>{order.customer_name}</p>
                        {order.shipping_address && (
                            <p style={{ margin: '0 0 4px' }}>
                                {order.shipping_address}
                            </p>
                        )}
                        {(order.shipping_city || order.shipping_state) && (
                            <p style={{ margin: '0 0 4px' }}>
                                {[order.shipping_city, order.shipping_state]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                        )}
                        {order.customer_phone && (
                            <p style={{ margin: '8px 0 0' }}>{order.customer_phone}</p>
                        )}
                        {order.customer_note && (
                            <p
                                style={{
                                    margin: '16px 0 0',
                                    padding: '12px 16px',
                                    background: '#fafaf8',
                                    border: '1px solid #e8e8e1',
                                }}
                            >
                                <span style={metaLabelStyle}>Note: </span>
                                {order.customer_note}
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </StorefrontShell>
    );
}

const metaLabelStyle: React.CSSProperties = {
    margin: '0 0 6px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#999',
};

const metaValueStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#060606',
};

const sectionTitleStyle: React.CSSProperties = {
    fontFamily: '"Proza Libre", sans-serif',
    fontSize: '18px',
    fontWeight: 500,
    color: '#060606',
    margin: '0 0 16px',
};
