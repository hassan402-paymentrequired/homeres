import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    FolderTree,
    Package,
    ShoppingBag,
    Tags,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminStatCard from '@/components/admin/admin-stat-card';
import StatusBreakdown from '@/components/admin/status-breakdown';
import AdminLayout from '@/layouts/admin-layout';
import { formatAdminMoney } from '@/lib/admin-money';

type OverviewStats = {
    categories_count: number;
    brands_count: number;
    products_count: number;
    draft_products_count: number;
    product_templates_count: number;
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

type MonthlyTotal = {
    month: string;
    label: string;
    total: number;
    orders_count: number;
};

type Props = {
    stats: OverviewStats;
    orders_by_status: StatusRow[];
    invoices_by_status: StatusRow[];
    monthly_order_totals: MonthlyTotal[];
};

function AdminAnalytics({
    stats,
    orders_by_status,
    invoices_by_status,
    monthly_order_totals,
}: Props) {
    const maxMonthlyTotal = Math.max(
        ...monthly_order_totals.map((row) => row.total),
        1,
    );

    return (
        <>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Insights
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Analytics
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Operational metrics from orders and invoices in your
                        database. Online payment reporting will expand once
                        Paystack is connected.
                    </p>
                </div>

                <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="Orders (30 days)"
                        value={stats.orders_last_30_days}
                        icon={ShoppingBag}
                        href="/admin/orders"
                    />
                    <AdminStatCard
                        label="Order value (30 days)"
                        value={formatAdminMoney(stats.orders_revenue_last_30_days)}
                        icon={ShoppingBag}
                    />
                    <AdminStatCard
                        label="Invoices collected"
                        value={formatAdminMoney(stats.invoices_collected_total)}
                        icon={FileText}
                        href="/admin/invoices"
                    />
                    <AdminStatCard
                        label="Outstanding invoices"
                        value={formatAdminMoney(stats.invoices_outstanding_total)}
                        icon={FileText}
                        href="/admin/invoices"
                    />
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Order value by month
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Last six months · excludes cancelled orders
                    </p>
                    <ul className="mt-6 space-y-4">
                        {monthly_order_totals.map((row) => (
                            <li key={row.month}>
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span>{row.label}</span>
                                    <span className="text-right">
                                        <span className="font-medium tabular-nums">
                                            {formatAdminMoney(row.total)}
                                        </span>
                                        <span className="ml-2 text-muted-foreground">
                                            · {row.orders_count}{' '}
                                            {row.orders_count === 1
                                                ? 'order'
                                                : 'orders'}
                                        </span>
                                    </span>
                                </div>
                                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-foreground/70"
                                        style={{
                                            width: `${(row.total / maxMonthlyTotal) * 100}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
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

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Catalog snapshot
                    </h2>
                    <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
                        <AdminStatCard
                            label="All-time order value"
                            value={formatAdminMoney(stats.orders_revenue_total)}
                            icon={ShoppingBag}
                        />
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    <Link
                        href="/admin"
                        prefetch
                        className="underline underline-offset-4 hover:text-foreground"
                    >
                        Back to dashboard
                    </Link>
                </p>
            </div>
        </>
    );
}

AdminAnalytics.layout = (page: ReactNode) => (
    <AdminLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Analytics', href: '/admin/analytics' },
        ]}
    >
        {page}
    </AdminLayout>
);

export default AdminAnalytics;
