import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Copy, Pencil } from 'lucide-react';
import { useState } from 'react';
import AdminDetailSummaryCard, {
    AdminDetailSection,
} from '@/components/admin/admin-detail-summary-card';
import InvoiceDocumentPreview, {
    type InvoicePreviewPayload,
} from '@/components/admin/invoice-document-preview';
import InvoiceSendForm from '@/components/admin/invoice-send-form';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
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
    InvoiceBreadcrumb,
    InvoiceItemRecord,
    InvoiceRecord,
    InvoiceStatus,
    InvoiceStatusOption,
} from '@/types/invoice';

type Props = {
    invoice: InvoiceRecord;
    preview: InvoicePreviewPayload;
    statusOptions: InvoiceStatusOption[];
    canSend: boolean;
    canEdit: boolean;
    canDuplicate: boolean;
    breadcrumbs: InvoiceBreadcrumb[];
};

const linkButtonStyle: React.CSSProperties = {
    ...adminCompactSecondaryButtonStyle,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
};

const cardTitleStyle: React.CSSProperties = {
    fontFamily: '"Proza Libre", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: '#060606',
    margin: 0,
};

function formatDateTime(iso: string | null): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatDateInput(iso: string | null): string {
    if (!iso) {
        return '';
    }

    return new Date(iso).toISOString().slice(0, 10);
}

function formatMoney(amount: number | null): string {
    if (amount === null) {
        return '—';
    }

    return `₦${Number(amount).toLocaleString('en-NG')}`;
}

function formatInvoiceTotal(invoice: InvoiceRecord): string {
    if (invoice.has_price_on_request_items && invoice.total === null) {
        return 'Price on request';
    }

    return formatMoney(invoice.total);
}

function formatItemPrice(item: InvoiceItemRecord): string {
    if (item.price_on_request) {
        return 'Price on request';
    }

    return formatMoney(item.unit_price);
}

function formatLineTotal(item: InvoiceItemRecord): string {
    if (item.price_on_request) {
        return 'Enquire';
    }

    return formatMoney(item.line_total);
}

export default function InvoiceShow({
    invoice,
    preview,
    statusOptions,
    canSend,
    canEdit,
    canDuplicate,
    breadcrumbs,
}: Props) {
    const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const billingLines = [
        invoice.billing_address,
        [invoice.billing_city, invoice.billing_state]
            .filter(Boolean)
            .join(', '),
    ].filter(Boolean);

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={invoice.invoice_number} />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-serif text-2xl font-medium tracking-wide">
                                {invoice.invoice_number}
                            </h1>
                            <InvoiceStatusBadge
                                label={invoice.status_label}
                                status={invoice.status}
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {invoice.order_id ? (
                                <span>
                                    Order{' '}
                                    <Link
                                        href={`/admin/orders/${invoice.order_id}`}
                                        className="font-medium text-foreground underline-offset-4 hover:underline"
                                    >
                                        {invoice.order_number}
                                    </Link>
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canDuplicate ? (
                            <Link
                                href={`/admin/invoices/create?duplicate=${invoice.id}`}
                                style={linkButtonStyle}
                            >
                                <Copy className="size-3.5" />
                                Duplicate
                            </Link>
                        ) : null}
                        {canEdit ? (
                            <Link
                                href={`/admin/invoices/${invoice.id}/edit`}
                                style={{
                                    ...adminCompactPrimaryButtonStyle(),
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    textDecoration: 'none',
                                }}
                            >
                                <Pencil className="size-3.5" />
                                Edit draft
                            </Link>
                        ) : null}
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <AdminDetailSummaryCard title="Bill to">
                        <p className="font-medium">{invoice.customer_name}</p>
                        <p className="mt-2">
                            <a
                                href={`mailto:${invoice.customer_email}`}
                                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {invoice.customer_email}
                            </a>
                        </p>
                        {invoice.customer_phone ? (
                            <p className="mt-1 text-muted-foreground">
                                {invoice.customer_phone}
                            </p>
                        ) : null}
                    </AdminDetailSummaryCard>

                    <AdminDetailSummaryCard title="Billing address">
                        {billingLines.length > 0 ? (
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {billingLines.join('\n')}
                            </p>
                        ) : (
                            <p className="text-muted-foreground">—</p>
                        )}
                    </AdminDetailSummaryCard>

                    <AdminDetailSummaryCard title="Dates">
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Issued
                                </dt>
                                <dd className="font-medium">
                                    {formatDateTime(invoice.issued_at)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Due
                                </dt>
                                <dd className="font-medium">
                                    {formatDateTime(invoice.due_at)}
                                </dd>
                            </div>
                            {invoice.paid_at ? (
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Paid
                                    </dt>
                                    <dd className="font-medium">
                                        {formatDateTime(invoice.paid_at)}
                                    </dd>
                                </div>
                            ) : null}
                        </dl>
                    </AdminDetailSummaryCard>
                </div>

                <AdminDetailSection title="Line items">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-sidebar-border/70 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Item
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
                                {invoice.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-sidebar-border/50 last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.variant_name}
                                                {item.sku ? ` · ${item.sku}` : ''}
                                            </p>
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
                                        colSpan={3}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Subtotal
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {invoice.has_price_on_request_items &&
                                        invoice.subtotal === null
                                            ? 'Price on request'
                                            : formatMoney(invoice.subtotal)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Discount
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatMoney(invoice.discount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Tax
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatMoney(invoice.tax)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-3 text-right text-muted-foreground"
                                    >
                                        Shipping
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatMoney(invoice.shipping_total)}
                                    </td>
                                </tr>
                                <tr className="border-t border-sidebar-border/70">
                                    <td
                                        colSpan={3}
                                        className="px-4 py-3 text-right font-medium"
                                    >
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-right font-serif text-lg font-medium">
                                        {formatInvoiceTotal(invoice)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </AdminDetailSection>

                {invoice.customer_note ? (
                    <AdminDetailSummaryCard title="Customer note">
                        <p className="leading-relaxed text-muted-foreground">
                            {invoice.customer_note}
                        </p>
                    </AdminDetailSummaryCard>
                ) : null}

                <AdminDetailSection title="Invoice document">
                    <div className="overflow-x-auto p-4 md:p-6">
                        <InvoiceDocumentPreview invoice={preview} />
                    </div>
                </AdminDetailSection>

                <div
                    className={`grid gap-6 ${canSend ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
                >
                    {canSend ? (
                        <InvoiceSendForm
                            action={`/admin/invoices/${invoice.id}/send`}
                            defaultEmail={invoice.customer_email}
                            submitLabel={
                                invoice.status === 'draft'
                                    ? 'Send invoice'
                                    : 'Resend invoice'
                            }
                            errors={errors}
                            hint="Email this invoice to the customer. Draft and sent invoices will be marked as Sent."
                        />
                    ) : null}

                    <Form
                        action={`/admin/invoices/${invoice.id}`}
                        method="put"
                        className="h-full w-full"
                    >
                        {({ processing, errors: formErrors }) => (
                            <Card className="h-full border-sidebar-border/70 py-0 shadow-none">
                                <CardHeader className="border-b border-sidebar-border/70 py-6">
                                    <p style={cardTitleStyle}>Billing status</p>
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
                                                            .value as InvoiceStatus,
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
                                                htmlFor="due_at"
                                                style={storefrontLabelStyle}
                                            >
                                                Due date
                                            </label>
                                            <input
                                                id="due_at"
                                                name="due_at"
                                                type="date"
                                                defaultValue={formatDateInput(
                                                    invoice.due_at,
                                                )}
                                                style={storefrontInputStyle}
                                            />
                                            <p style={storefrontHintStyle}>
                                                Payment expected by this date.
                                            </p>
                                            {formErrors.due_at ? (
                                                <p style={storefrontErrorStyle}>
                                                    {formErrors.due_at}
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
                                                    invoice.admin_note ?? ''
                                                }
                                                placeholder="Payment reference, bank transfer details, follow-up notes…"
                                                style={storefrontTextareaStyle}
                                            />
                                            <p style={storefrontHintStyle}>
                                                Visible to admins only — not shown
                                                on customer-facing invoices.
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
