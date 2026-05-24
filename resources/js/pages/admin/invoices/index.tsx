import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { InvoiceSummary } from '@/types/invoice';
import type { Paginated } from '@/types/pagination';

type Props = {
    invoices: Paginated<InvoiceSummary>;
};

function formatDate(iso: string | null): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleDateString('en-NG', {
        dateStyle: 'medium',
    });
}

function formatTotal(invoice: InvoiceSummary): string {
    if (invoice.has_price_on_request_items && invoice.total === null) {
        return 'Price on request';
    }

    if (invoice.total === null) {
        return '—';
    }

    return `₦${Number(invoice.total).toLocaleString('en-NG')}`;
}

export default function InvoicesIndex({ invoices }: Props) {
    const items = invoices.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Invoices', href: '/admin/invoices' },
            ]}
        >
            <Head title="Invoices" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Billing
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Invoices
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Review billing records, track payment status, and compose
                            invoices for customers.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/invoices/create">
                            <FileText className="size-4" />
                            New invoice
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={FileText}
                        title="No invoices yet"
                        description="Invoices generated from orders will appear here. Sample invoices can be seeded for preview."
                    />
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <table className="w-full text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Invoice
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Order
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Issued
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Due
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="border-b border-sidebar-border/50 last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/invoices/${invoice.id}`}
                                                    className="font-medium transition hover:opacity-80"
                                                >
                                                    {invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {invoice.customer_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {invoice.customer_email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {invoice.order_id ? (
                                                    <Link
                                                        href={`/admin/orders/${invoice.order_id}`}
                                                        className="transition hover:opacity-80"
                                                    >
                                                        {invoice.order_number}
                                                    </Link>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(invoice.issued_at)}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(invoice.due_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <InvoiceStatusBadge
                                                    label={invoice.status_label}
                                                    status={invoice.status}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {formatTotal(invoice)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/invoices/${invoice.id}`}
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

                        <AdminPagination paginator={invoices} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
