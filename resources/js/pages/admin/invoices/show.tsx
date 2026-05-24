import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Copy, Pencil } from 'lucide-react';
import { useState } from 'react';
import AdminDetailSummaryCard, {
    AdminDetailSection,
} from '@/components/admin/admin-detail-summary-card';
import FormField, { FormSection } from '@/components/admin/form-field';
import InvoiceDocumentPreview, {
    type InvoicePreviewPayload,
} from '@/components/admin/invoice-document-preview';
import InvoiceSendForm from '@/components/admin/invoice-send-form';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type {
    InvoiceBreadcrumb,
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
                            <Button asChild variant="outline">
                                <Link
                                    href={`/admin/invoices/create?duplicate=${invoice.id}`}
                                >
                                    <Copy className="size-4" />
                                    Duplicate
                                </Link>
                            </Button>
                        ) : null}
                        {canEdit ? (
                            <Button asChild variant="outline">
                                <Link href={`/admin/invoices/${invoice.id}/edit`}>
                                    <Pencil className="size-4" />
                                    Edit draft
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                    <AdminDetailSummaryCard title="Invoice total">
                        <p className="font-serif text-2xl font-medium">
                            {formatInvoiceTotal(invoice)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {invoice.items.length}{' '}
                            {invoice.items.length === 1 ? 'line' : 'lines'}
                        </p>
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

                <AdminDetailSection title="Invoice document">
                    <div className="p-4 md:p-6">
                        <InvoiceDocumentPreview invoice={preview} />
                    </div>
                </AdminDetailSection>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <AdminDetailSummaryCard title="Invoice totals">
                            <dl className="space-y-3">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Subtotal
                                    </dt>
                                    <dd className="font-medium">
                                        {invoice.has_price_on_request_items &&
                                        invoice.subtotal === null
                                            ? 'Price on request'
                                            : formatMoney(invoice.subtotal)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Discount
                                    </dt>
                                    <dd className="font-medium">
                                        {formatMoney(invoice.discount)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Tax
                                    </dt>
                                    <dd className="font-medium">
                                        {formatMoney(invoice.tax)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Shipping
                                    </dt>
                                    <dd className="font-medium">
                                        {formatMoney(invoice.shipping_total)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-sidebar-border/70 pt-3">
                                    <dt className="font-medium">Total</dt>
                                    <dd className="font-serif text-lg font-medium">
                                        {formatInvoiceTotal(invoice)}
                                    </dd>
                                </div>
                            </dl>
                        </AdminDetailSummaryCard>

                        {invoice.customer_note ? (
                            <AdminDetailSummaryCard title="Customer note">
                                <p className="leading-relaxed text-muted-foreground">
                                    {invoice.customer_note}
                                </p>
                            </AdminDetailSummaryCard>
                        ) : null}
                    </div>

                    <div className="space-y-6">
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
                            className="w-full"
                        >
                            {({ processing, errors: formErrors }) => (
                                <Card className="border-sidebar-border/70 py-0 shadow-none">
                                    <CardHeader className="border-b border-sidebar-border/70 py-6">
                                        <p className="text-sm font-medium">
                                            Billing status
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-6 py-6">
                                        <FormSection>
                                            <FormField
                                                label="Status"
                                                htmlFor="status"
                                                error={formErrors.status}
                                            >
                                                <Select
                                                    value={status}
                                                    onValueChange={(value) =>
                                                        setStatus(
                                                            value as InvoiceStatus,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger id="status">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="hidden"
                                                    name="status"
                                                    value={status}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Due date"
                                                htmlFor="due_at"
                                                hint="Payment expected by this date."
                                                error={formErrors.due_at}
                                            >
                                                <Input
                                                    id="due_at"
                                                    name="due_at"
                                                    type="date"
                                                    defaultValue={formatDateInput(
                                                        invoice.due_at,
                                                    )}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Internal note"
                                                htmlFor="admin_note"
                                                hint="Visible to admins only — not shown on customer-facing invoices."
                                                error={formErrors.admin_note}
                                            >
                                                <Textarea
                                                    id="admin_note"
                                                    name="admin_note"
                                                    rows={4}
                                                    defaultValue={
                                                        invoice.admin_note ?? ''
                                                    }
                                                    placeholder="Payment reference, bank transfer details, follow-up notes…"
                                                />
                                            </FormField>
                                        </FormSection>
                                    </CardContent>

                                    <CardFooter className="border-t border-sidebar-border/70 py-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Save changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
