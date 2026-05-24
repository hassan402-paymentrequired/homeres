import { Head, Link } from '@inertiajs/react';
import {
    BarChart3,
    FileText,
    FolderTree,
    Package,
    ShoppingBag,
    Tags,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminStatCard from '@/components/admin/admin-stat-card';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
import OrderStatusBadge from '@/components/admin/order-status-badge';
import StatusBreakdown from '@/components/admin/status-breakdown';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { formatAdminDate, formatAdminMoney } from '@/lib/admin-money';
import type { InvoiceStatus } from '@/types/invoice';
import type { OrderStatus } from '@/types/order';

type OverviewStats = {
    categories_count: number;
    brands_count: number;
    products_count: number;
    draft_products_count: number;
    orders_count: number;
    orders_pending_count: number;
    orders_last_30_days: number;
    invoices_count: number;
    invoices_draft_count: number;
    invoices_paid_count: number;
    orders_revenue_total: number;
    orders_revenue_last_30_days: number;
    invoices_collected_total: number;
    invoices_outstanding_total: number;
};

type StatusRow = {
    value: string;
    label: string;
    count: number;
};

type RecentOrder = {
    id: string;
    order_number: string;
    customer_name: string;
    status: string;
    status_label: string;
    total: number | null;
    has_price_on_request_items: boolean;
    placed_at: string;
};

type RecentInvoice = {
    id: string;
    invoice_number: string;
    customer_name: string;
    status: string;
    status_label: string;
    total: number | null;
    has_price_on_request_items: boolean;
    issued_at: string | null;
};

type Props = {
    stats: OverviewStats;
    orders_by_status: StatusRow[];
    invoices_by_status: StatusRow[];
    recent_orders: RecentOrder[];
    recent_invoices: RecentInvoice[];
};

function AdminDashboard({
    stats,
    orders_by_status,
    invoices_by_status,
    recent_orders,
    recent_invoices,
}: Props) {
    return (
        <>
            <Head title="Admin dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Homère admin
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Dashboard
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Catalog health, fulfilment pipeline, and recent
                            commerce activity at a glance.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/analytics" prefetch>
                            <BarChart3 className="size-4" />
                            View analytics
                        </Link>
                    </Button>
                </div>

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Commerce
                    </h2>
                    <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <AdminStatCard
                            label="Orders"
                            value={stats.orders_count}
                            icon={ShoppingBag}
                            href="/admin/orders"
                            hint={`${stats.orders_pending_count} pending · ${stats.orders_last_30_days} last 30 days`}
                        />
                        <AdminStatCard
                            label="Order value"
                            value={formatAdminMoney(stats.orders_revenue_total)}
                            icon={ShoppingBag}
                            href="/admin/orders"
                            hint={`${formatAdminMoney(stats.orders_revenue_last_30_days)} last 30 days`}
                        />
                        <AdminStatCard
                            label="Invoices"
                            value={stats.invoices_count}
                            icon={FileText}
                            href="/admin/invoices"
                            hint={`${stats.invoices_draft_count} draft · ${stats.invoices_paid_count} paid`}
                        />
                        <AdminStatCard
                            label="Collected"
                            value={formatAdminMoney(stats.invoices_collected_total)}
                            icon={FileText}
                            href="/admin/invoices"
                            hint={`${formatAdminMoney(stats.invoices_outstanding_total)} outstanding`}
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Catalog
                    </h2>
                    <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <AdminStatCard
                            label="Categories"
                            value={stats.categories_count}
                            icon={FolderTree}
                            href="/admin/categories"
                        />
                        <AdminStatCard
                            label="Brands"
                            value={stats.brands_count}
                            icon={Tags}
                            href="/admin/brands"
                        />
                        <AdminStatCard
                            label="Products"
                            value={stats.products_count}
                            icon={Package}
                            href="/admin/products"
                        />
                        <AdminStatCard
                            label="Draft products"
                            value={stats.draft_products_count}
                            icon={Package}
                            href="/admin/products"
                        />
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <StatusBreakdown
                        title="Orders by status"
                        rows={orders_by_status}
                    />
                    <StatusBreakdown
                        title="Invoices by status"
                        rows={invoices_by_status}
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <RecentTable
                        title="Recent orders"
                        empty="No orders yet."
                        viewAllHref="/admin/orders"
                        rows={recent_orders.map((order) => ({
                            key: order.id,
                            href: `/admin/orders/${order.id}`,
                            primary: order.order_number,
                            secondary: order.customer_name,
                            meta: formatAdminDate(order.placed_at),
                            amount: formatAdminMoney(
                                order.total,
                                order.has_price_on_request_items,
                            ),
                            badge: (
                                <OrderStatusBadge
                                    status={order.status as OrderStatus}
                                    label={order.status_label}
                                />
                            ),
                        }))}
                    />
                    <RecentTable
                        title="Recent invoices"
                        empty="No invoices yet."
                        viewAllHref="/admin/invoices"
                        rows={recent_invoices.map((invoice) => ({
                            key: invoice.id,
                            href: `/admin/invoices/${invoice.id}`,
                            primary: invoice.invoice_number,
                            secondary: invoice.customer_name,
                            meta: invoice.issued_at
                                ? formatAdminDate(invoice.issued_at)
                                : '—',
                            amount: formatAdminMoney(
                                invoice.total,
                                invoice.has_price_on_request_items,
                            ),
                            badge: (
                                <InvoiceStatusBadge
                                    status={invoice.status as InvoiceStatus}
                                    label={invoice.status_label}
                                />
                            ),
                        }))}
                    />
                </div>
            </div>
        </>
    );
}

type RecentRow = {
    key: string;
    href: string;
    primary: string;
    secondary: string;
    meta: string;
    amount: string;
    badge: ReactNode;
};

function RecentTable({
    title,
    empty,
    viewAllHref,
    rows,
}: {
    title: string;
    empty: string;
    viewAllHref: string;
    rows: RecentRow[];
}) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 py-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                    {title}
                </h2>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={viewAllHref} prefetch>
                        View all
                    </Link>
                </Button>
            </div>
            {rows.length === 0 ? (
                <p className="px-4 py-8 text-sm text-muted-foreground">
                    {empty}
                </p>
            ) : (
                <ul className="divide-y divide-sidebar-border/70">
                    {rows.map((row) => (
                        <li key={row.key}>
                            <Link
                                href={row.href}
                                prefetch
                                className="flex flex-col gap-2 px-4 py-3 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-medium">
                                            {row.primary}
                                        </span>
                                        {row.badge}
                                    </div>
                                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                        {row.secondary}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {row.meta}
                                    </p>
                                </div>
                                <p className="shrink-0 text-sm font-medium tabular-nums">
                                    {row.amount}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

AdminDashboard.layout = (page: ReactNode) => (
    <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
        {page}
    </AdminLayout>
);

export default AdminDashboard;
