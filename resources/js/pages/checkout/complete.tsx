import { Head, Link } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { formatNaira } from '@/lib/cart';

type OrderPayload = {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    customer_name: string;
    total: number | null;
    has_price_on_request_items: boolean;
};

type Props = {
    order: OrderPayload;
};

export default function CheckoutCompletePage({ order }: Props) {
    const totalLabel =
        order.has_price_on_request_items || order.total === null
            ? 'Price on request'
            : formatNaira(order.total);

    return (
        <StorefrontShell>
            <Head title="Order confirmed" />
            <div
                style={{
                    maxWidth: '640px',
                    margin: '0 auto',
                    padding: '64px 30px',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: '28px',
                        marginBottom: '12px',
                    }}
                >
                    Thank you, {order.customer_name.split(' ')[0]}
                </h1>
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#6b6b6b',
                        lineHeight: 1.6,
                    }}
                >
                    Your order <strong>{order.order_number}</strong> has been
                    received.{' '}
                    {order.payment_status === 'paid'
                        ? 'Payment was successful.'
                        : order.payment_status === 'not_required'
                          ? 'Our team will contact you with pricing and delivery details.'
                          : 'We will confirm payment shortly.'}
                </p>
                <p
                    style={{
                        marginTop: '24px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '16px',
                    }}
                >
                    Total: {totalLabel}
                </p>
                <Link
                    href="/shop"
                    style={{
                        display: 'inline-block',
                        marginTop: '32px',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#060606',
                    }}
                >
                    Continue shopping
                </Link>
            </div>
        </StorefrontShell>
    );
}
