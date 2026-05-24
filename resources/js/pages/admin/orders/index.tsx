import { Head, Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import OrderStatusBadge from '@/components/admin/order-status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { OrderSummary } from '@/types/order';
import type { Paginated } from '@/types/pagination';

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

    return `₦${Number(order.total).toLocaleString('en-NG')}`;
}

export default function OrdersIndex({ orders }: Props) {
    const items = orders.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Orders', href: '/admin/orders' },
            ]}
        >
            <Head title="Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Fulfilment
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Orders
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Track customer orders, update fulfilment status, and review
                        line items at a glance.
                    </p>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={ShoppingBag}
                        title="No orders yet"
                        description="Orders placed through checkout will appear here. Sample orders can be seeded for preview."
                    />
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <table className="w-full text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Order
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Placed
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Items
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-sidebar-border/50 last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="font-medium transition hover:opacity-80"
                                                >
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.customer_email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatPlacedAt(order.placed_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <OrderStatusBadge
                                                    label={order.status_label}
                                                    status={order.status}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {order.items_count}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {formatTotal(order)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination paginator={orders} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
