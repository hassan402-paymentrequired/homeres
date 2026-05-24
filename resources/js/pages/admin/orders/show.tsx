import { Form, Head, Link, usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import FormField, { FormSection } from '@/components/admin/form-field';
import InvoiceSendForm from '@/components/admin/invoice-send-form';
import InvoiceStatusBadge from '@/components/admin/invoice-status-badge';
import OrderStatusBadge from '@/components/admin/order-status-badge';
import StockStatusBadge from '@/components/admin/stock-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={order.order_number} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
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
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <div className="border-b border-sidebar-border/70 bg-muted/30 px-4 py-3">
                                <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                    Line items
                                </h2>
                            </div>
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
                                                    label={
                                                        item.stock_status_label
                                                    }
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
                            </table>
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Order totals
                            </h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Subtotal
                                    </dt>
                                    <dd className="font-medium">
                                        {order.has_price_on_request_items &&
                                        order.subtotal === null
                                            ? 'Price on request'
                                            : formatMoney(order.subtotal)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Shipping
                                    </dt>
                                    <dd className="font-medium">
                                        {formatMoney(order.shipping_total)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4 border-t border-sidebar-border/70 pt-3">
                                    <dt className="font-medium">Total</dt>
                                    <dd className="font-serif text-lg font-medium">
                                        {order.has_price_on_request_items &&
                                        order.total === null
                                            ? 'Price on request'
                                            : formatMoney(order.total)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Customer
                            </h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">
                                        Name
                                    </dt>
                                    <dd className="mt-1 font-medium">
                                        {order.customer_name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Email
                                    </dt>
                                    <dd className="mt-1">
                                        <a
                                            href={`mailto:${order.customer_email}`}
                                            className="font-medium underline-offset-4 hover:underline"
                                        >
                                            {order.customer_email}
                                        </a>
                                    </dd>
                                </div>
                                {order.customer_phone ? (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Phone
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.customer_phone}
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>
                        </div>

                        {shippingLines.length > 0 ? (
                            <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
                                <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                    Shipping
                                </h2>
                                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                    {shippingLines.join('\n')}
                                </p>
                            </div>
                        ) : null}

                        {order.customer_note ? (
                            <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
                                <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                    Customer note
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                    {order.customer_note}
                                </p>
                            </div>
                        ) : null}

                        {canCreateInvoice ? (
                            <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 size-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                            Billing
                                        </h2>
                                        {invoice ? (
                                            <div className="mt-4 flex flex-wrap items-center gap-2">
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
                                        ) : (
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                No invoice yet. Compose one from
                                                this order&apos;s line items.
                                            </p>
                                        )}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {invoice ? (
                                                <>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/admin/invoices/${invoice.id}`}
                                                        >
                                                            View invoice
                                                        </Link>
                                                    </Button>
                                                    {invoice.status ===
                                                    'draft' ? (
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/admin/invoices/${invoice.id}/edit`}
                                                            >
                                                                Edit draft
                                                            </Link>
                                                        </Button>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <>
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link
                                                            href={`/admin/invoices/create?order_id=${order.id}`}
                                                        >
                                                            Compose invoice
                                                        </Link>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

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
                            className="w-full"
                        >
                            {({ processing, errors }) => (
                                <Card className="border-sidebar-border/70 py-0 shadow-none">
                                    <CardHeader className="border-b border-sidebar-border/70 py-6">
                                        <p className="text-sm font-medium">
                                            Fulfilment
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-6 py-6">
                                        <FormSection>
                                            <FormField
                                                label="Status"
                                                htmlFor="status"
                                                error={errors.status}
                                            >
                                                <Select
                                                    value={status}
                                                    onValueChange={(value) =>
                                                        setStatus(
                                                            value as OrderStatus,
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
                                                label="Internal note"
                                                htmlFor="admin_note"
                                                hint="Visible to admins only — not shown to the customer."
                                                error={errors.admin_note}
                                            >
                                                <Textarea
                                                    id="admin_note"
                                                    name="admin_note"
                                                    rows={4}
                                                    defaultValue={
                                                        order.admin_note ?? ''
                                                    }
                                                    placeholder="Delivery instructions, supplier follow-up, etc."
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
