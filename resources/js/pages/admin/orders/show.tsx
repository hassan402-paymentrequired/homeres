import { Form, Head, Link, usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import AdminDetailSummaryCard, {
    AdminDetailSection,
} from '@/components/admin/admin-detail-summary-card';
import InvoiceSendForm from '@/components/admin/invoice-send-form';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
import OrderStatusBadge from '@/components/admin/order-status-badge';
import StockStatusBadge from '@/components/admin/stock-status-badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import {
    adminCompactPrimaryButtonStyle,
    adminCompactSecondaryButtonStyle,
    storefrontErrorStyle,
    storefrontHintStyle,
    storefrontInputStyle,
    storefrontLabelStyle,
    storefrontTextareaStyle,
} from '@/lib/storefront-form-styles';
import type {
    OrderBreadcrumb,
    OrderInvoiceSummary,
    OrderRecord,
    OrderStatus,
    OrderStatusOption,
} from '@/types/order';

type Props = {
    order: OrderRecord;
    invoice: OrderInvoiceSummary | null;
    canCreateInvoice: boolean;
    statusOptions: OrderStatusOption[];
    breadcrumbs: OrderBreadcrumb[];
};

const linkButtonStyle: React.CSSProperties = {
    ...adminCompactSecondaryButtonStyle,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
};

function formatPlacedAt(iso: string): string {
    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'full',
        timeStyle: 'short',
    });
}

function formatMoney(amount: number | null): string {
    if (amount === null) {
        return '—';
    }

    return `₦${Number(amount).toLocaleString('en-NG')}`;
}

function formatItemPrice(item: OrderRecord['items'][number]): string {
    if (item.price_on_request) {
        return 'Price on request';
    }

    return formatMoney(item.unit_price);
}

function formatLineTotal(item: OrderRecord['items'][number]): string {
    if (item.price_on_request) {
        return 'Enquire';
    }

    return formatMoney(item.line_total);
}

function formatOrderTotal(order: OrderRecord): string {
    if (order.has_price_on_request_items && order.total === null) {
        return 'Price on request';
    }

    return formatMoney(order.total);
}

export default function OrderShow({
    order,
    invoice,
    canCreateInvoice,
    statusOptions,
    breadcrumbs,
}: Props) {
    const [status, setStatus] = useState<OrderStatus>(order.status);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const shippingLines = [
        order.shipping_address,
        [order.shipping_city, order.shipping_state].filter(Boolean).join(', '),
    ].filter(Boolean);

    const showInvoiceForm =
        (canCreateInvoice && !invoice) ||
        (invoice !== null && invoice.status !== 'void');

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={order.order_number} />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <header>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-serif text-2xl font-medium tracking-wide">
                            {order.order_number}
                        </h1>
                        <OrderStatusBadge
                            label={order.status_label}
                            status={order.status}
                        />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Placed {formatPlacedAt(order.placed_at)}
                    </p>
                </header>

                <div
                    className={`grid gap-4 sm:grid-cols-2 ${canCreateInvoice ? 'xl:grid-cols-3' : 'xl:grid-cols-2'}`}
                >
                    <AdminDetailSummaryCard title="Customer">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="mt-2">
                            <a
                                href={`mailto:${order.customer_email}`}
                                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {order.customer_email}
                            </a>
                        </p>
                        {order.customer_phone ? (
                            <p className="mt-1 text-muted-foreground">
                                {order.customer_phone}
                            </p>
                        ) : null}
                    </AdminDetailSummaryCard>

                    <AdminDetailSummaryCard title="Shipping">
                        {shippingLines.length > 0 ? (
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {shippingLines.join('\n')}
                            </p>
                        ) : (
                            <p className="text-muted-foreground">—</p>
                        )}
                    </AdminDetailSummaryCard>

                    {canCreateInvoice ? (
                        <AdminDetailSummaryCard title="Invoice">
                            {invoice ? (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/admin/invoices/${invoice.id}`}
                                            className="font-medium underline-offset-4 hover:underline"
                                        >
                                            {invoice.invoice_number}
                                        </Link>
                                        <InvoiceStatusBadge
                                            label={invoice.status_label}
                                            status={invoice.status}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Link
                                            href={`/admin/invoices/${invoice.id}`}
                                            style={linkButtonStyle}
                                        >
                                            View
                                        </Link>
                                        {invoice.status === 'draft' ? (
                                            <Link
                                                href={`/admin/invoices/${invoice.id}/edit`}
                                                style={{
                                                    ...adminCompactPrimaryButtonStyle(),
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Edit
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">
                                        No invoice yet.
                                    </p>
                                    <Link
                                        href={`/admin/invoices/create?order_id=${order.id}`}
                                        style={linkButtonStyle}
                                    >
                                        <FileText className="size-3.5" />
                                        Compose
                                    </Link>
                                </div>
                            )}
                        </AdminDetailSummaryCard>
                    ) : null}
                </div>

                <AdminDetailSection title="Line items">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-sidebar-border/70 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Unit
                                    </th>
                                    <th className="px-4 py-3 font-medium text-right">
                                        Line total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-sidebar-border/50 last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.variant_name}
                                                    {item.sku
                                                        ? ` · ${item.sku}`
                                                        : ''}
                                                </p>
                                                {item.product_id ? (
                                                    <Link
                                                        href={`/admin/products/${item.product_id}`}
                                                        className="mt-1 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
                                                    >
                                                        View product
                                                    </Link>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StockStatusBadge
                                                label={item.stock_status_label}
                                                status={item.stock_status}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatItemPrice(item)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {formatLineTotal(item)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t border-sidebar-border/70 text-sm">
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Subtotal
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {order.has_price_on_request_items &&
                                        order.subtotal === null
                                            ? 'Price on request'
                                            : formatMoney(order.subtotal)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Shipping
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatMoney(order.shipping_total)}
                                    </td>
                                </tr>
                                <tr className="border-t border-sidebar-border/70">
                                    <td
                                        colSpan={4}
                                        className="px-4 py-3 text-right font-medium"
                                    >
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-right font-serif text-lg font-medium">
                                        {formatOrderTotal(order)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </AdminDetailSection>

                {order.customer_note ? (
                    <AdminDetailSummaryCard title="Customer note">
                        <p className="leading-relaxed text-muted-foreground">
                            {order.customer_note}
                        </p>
                    </AdminDetailSummaryCard>
                ) : null}

                <div
                    className={`grid gap-6 ${showInvoiceForm ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
                >
                    {canCreateInvoice && !invoice ? (
                        <InvoiceSendForm
                            action={`/admin/orders/${order.id}/invoice`}
                            defaultEmail={order.customer_email}
                            submitLabel="Create & send"
                            secondaryLabel="Quick draft"
                            errors={errors}
                            hint="Quickly snapshot this order into an invoice. Use Compose for full editing, discounts, and tax."
                        />
                    ) : null}

                    {invoice && invoice.status !== 'void' ? (
                        <InvoiceSendForm
                            action={`/admin/invoices/${invoice.id}/send`}
                            defaultEmail={order.customer_email}
                            submitLabel={
                                invoice.status === 'draft'
                                    ? 'Send invoice'
                                    : 'Resend invoice'
                            }
                            errors={errors}
                            hint="Email the invoice to the customer."
                        />
                    ) : null}

                    <Form
                        action={`/admin/orders/${order.id}`}
                        method="put"
                        className="h-full w-full"
                    >
                        {({ processing, errors: formErrors }) => (
                            <Card className="h-full border-sidebar-border/70 py-0 shadow-none">
                                <CardHeader className="border-b border-sidebar-border/70 py-6">
                                    <p
                                        style={{
                                            fontFamily:
                                                '"Proza Libre", sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: '#060606',
                                            margin: 0,
                                        }}
                                    >
                                        Fulfilment
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-6 py-6">
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        <div>
                                            <label
                                                htmlFor="status"
                                                style={storefrontLabelStyle}
                                            >
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                value={status}
                                                onChange={(event) =>
                                                    setStatus(
                                                        event.target
                                                            .value as OrderStatus,
                                                    )
                                                }
                                                style={storefrontInputStyle}
                                            >
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="hidden"
                                                name="status"
                                                value={status}
                                            />
                                            {formErrors.status ? (
                                                <p style={storefrontErrorStyle}>
                                                    {formErrors.status}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="admin_note"
                                                style={storefrontLabelStyle}
                                            >
                                                Internal note
                                            </label>
                                            <textarea
                                                id="admin_note"
                                                name="admin_note"
                                                rows={4}
                                                defaultValue={
                                                    order.admin_note ?? ''
                                                }
                                                placeholder="Delivery instructions, supplier follow-up, etc."
                                                style={storefrontTextareaStyle}
                                            />
                                            <p style={storefrontHintStyle}>
                                                Visible to admins only — not shown
                                                to the customer.
                                            </p>
                                            {formErrors.admin_note ? (
                                                <p style={storefrontErrorStyle}>
                                                    {formErrors.admin_note}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-wrap gap-2 border-t border-sidebar-border/70 py-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={adminCompactPrimaryButtonStyle(
                                            processing,
                                        )}
                                    >
                                        Save changes
                                    </button>
                                </CardFooter>
                            </Card>
                        )}
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}
