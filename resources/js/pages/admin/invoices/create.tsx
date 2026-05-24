import { Head, Link, useForm } from '@inertiajs/react';
import {
    Download,
    FileImage,
    FileText,
    Plus,
    Send,
    Trash2,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import FormField, { FormSection } from '@/components/admin/form-field';
import InvoiceDocumentPreview, {
    amountToDisplay,
    type InvoicePreviewPayload,
} from '@/components/admin/invoice-document-preview';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import {
    exportInvoicePreviewNode,
    pickFirstVisibleElement,
} from '@/lib/invoice-preview-export';
import { cn } from '@/lib/utils';
import type {
    InvoiceComposeBreadcrumb,
    InvoiceEditPayload,
    InvoicePrefill,
} from '@/types/invoice-compose';

type FormLine = {
    key: string;
    description: string;
    quantity: string;
    rate: string;
};

type FormData = {
    invoice_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    due_date: string;
    discount: string;
    tax: string;
    customer_note: string;
    order_id: string | null;
    items: FormLine[];
};

type PaymentDefaults = {
    payment_instructions: string | null;
};

type Props = {
    storeName: string;
    suggested_invoice_number: string;
    prefill: InvoicePrefill | null;
    edit_invoice: InvoiceEditPayload | null;
    payment_defaults: PaymentDefaults;
    breadcrumbs: InvoiceComposeBreadcrumb[];
};

function formatDueDate(iso: string): string | null {
    if (iso === '') {
        return null;
    }

    const date = new Date(`${iso}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
        return iso;
    }

    return date.toLocaleDateString('en-NG', { dateStyle: 'long' });
}

function randomKey(): string {
    const c = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

    if (c?.randomUUID) {
        return c.randomUUID();
    }

    return `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function parseMajor(raw: string | undefined | null): number {
    if (raw === undefined || raw === null || raw === '') {
        return 0;
    }

    const n = parseFloat(raw.replace(/,/g, ''));

    if (Number.isNaN(n) || n < 0) {
        return 0;
    }

    return n;
}

function parseQuantity(raw: string): number {
    const n = parseFloat(raw.replace(/,/g, ''));

    if (Number.isNaN(n) || n < 0) {
        return 0;
    }

    return n;
}

function defaultLines(source: InvoicePrefill | InvoiceEditPayload | null): FormLine[] {
    if (source !== null && source.lines.length > 0) {
        return source.lines.map((line) => ({
            key: randomKey(),
            description: line.description,
            quantity: line.quantity,
            rate: line.unit_price.toFixed(2),
        }));
    }

    return [
        {
            key: randomKey(),
            description: '',
            quantity: '1',
            rate: '0.00',
        },
    ];
}

function effectiveSource(
    prefill: InvoicePrefill | null,
    editInvoice: InvoiceEditPayload | null,
): InvoicePrefill | InvoiceEditPayload | null {
    return editInvoice ?? prefill;
}

export default function InvoiceCreate({
    storeName,
    suggested_invoice_number: suggestedInvoiceNumber,
    prefill,
    edit_invoice: editInvoice,
    payment_defaults: paymentDefaults,
}: Props) {
    const source = effectiveSource(prefill, editInvoice);
    const isEditing = editInvoice !== null;

    const [showPreview, setShowPreview] = useState(true);
    const [downloadWorking, setDownloadWorking] = useState(false);
    const previewMobileRef = useRef<HTMLDivElement | null>(null);
    const previewDesktopRef = useRef<HTMLDivElement | null>(null);
    const intentRef = useRef<'draft' | 'send'>('draft');

    const form = useForm<FormData>({
        invoice_number: source?.invoice_number ?? suggestedInvoiceNumber,
        customer_name: source?.customer_name ?? '',
        customer_email: source?.customer_email ?? '',
        customer_phone: source?.customer_phone ?? '',
        billing_address: source?.billing_address ?? '',
        billing_city: source?.billing_city ?? '',
        billing_state: source?.billing_state ?? '',
        due_date: source?.due_date ?? '',
        discount: source !== null ? source.discount.toFixed(2) : '0.00',
        tax: source !== null ? source.tax.toFixed(2) : '0.00',
        customer_note: source?.customer_note ?? '',
        order_id: source?.order_id ?? null,
        items: defaultLines(source),
    });

    form.transform((data) => {
        const items = (data.items ?? [])
            .filter((row) => row.description.trim() !== '')
            .map((row) => ({
                description: row.description.trim(),
                quantity: parseQuantity(row.quantity),
                unit_price: parseMajor(row.rate),
            }));

        const billingParts = [
            (data.billing_address ?? '').trim(),
            [data.billing_city, data.billing_state]
                .map((part) => (part ?? '').trim())
                .filter(Boolean)
                .join(', '),
        ].filter(Boolean);

        return {
            invoice_number: (data.invoice_number ?? '').trim(),
            customer_name: (data.customer_name ?? '').trim(),
            customer_email:
                (data.customer_email ?? '').trim() === ''
                    ? null
                    : (data.customer_email ?? '').trim(),
            customer_phone:
                (data.customer_phone ?? '').trim() === ''
                    ? null
                    : (data.customer_phone ?? '').trim(),
            billing_address:
                billingParts.length > 0 ? billingParts.join('\n') : null,
            billing_city: null,
            billing_state: null,
            due_date: data.due_date === '' ? null : data.due_date,
            discount: parseMajor(data.discount),
            tax: parseMajor(data.tax),
            customer_note:
                (data.customer_note ?? '').trim() === ''
                    ? null
                    : (data.customer_note ?? '').trim(),
            intent: intentRef.current,
            order_id: data.order_id,
            items,
        };
    });

    const previewInvoice: InvoicePreviewPayload = useMemo(() => {
        const rows = form.data.items ?? [];

        const { lines, subtotal } = rows.reduce(
            (
                acc: {
                    lines: InvoicePreviewPayload['lines'];
                    subtotal: number;
                },
                item,
            ) => {
                const qty = parseQuantity(item.quantity);
                const unit = parseMajor(item.rate);
                const lineTotal = Math.round(qty * unit * 100) / 100;

                return {
                    lines: [
                        ...acc.lines,
                        {
                            description: item.description,
                            quantity: item.quantity,
                            unit_price_display: amountToDisplay(unit),
                            line_total_display: amountToDisplay(lineTotal),
                        },
                    ],
                    subtotal: acc.subtotal + lineTotal,
                };
            },
            { lines: [], subtotal: 0 },
        );

        const discount = parseMajor(form.data.discount);
        const tax = parseMajor(form.data.tax);
        const total = Math.max(0, Math.round((subtotal - discount + tax) * 100) / 100);

        const billingDisplay = [
            form.data.billing_address.trim(),
            [form.data.billing_city, form.data.billing_state]
                .map((p) => p.trim())
                .filter(Boolean)
                .join(', '),
        ]
            .filter(Boolean)
            .join('\n');

        return {
            invoice_number:
                form.data.invoice_number.trim() || suggestedInvoiceNumber,
            store_name: storeName,
            customer_name: form.data.customer_name.trim() || '—',
            customer_email:
                form.data.customer_email.trim() === ''
                    ? null
                    : form.data.customer_email.trim(),
            billing_address: billingDisplay === '' ? null : billingDisplay,
            due_date: formatDueDate(form.data.due_date),
            lines,
            subtotal_display: amountToDisplay(subtotal),
            discount_display: amountToDisplay(discount),
            tax_display: amountToDisplay(tax),
            shipping_display: amountToDisplay(0),
            total_display: amountToDisplay(total),
            customer_note:
                form.data.customer_note.trim() === ''
                    ? null
                    : form.data.customer_note.trim(),
            payment_instructions: paymentDefaults.payment_instructions,
        };
    }, [form.data, storeName, suggestedInvoiceNumber, paymentDefaults]);

    function postIntent(intent: 'draft' | 'send') {
        intentRef.current = intent;

        if (isEditing) {
            form.put(`/admin/invoices/${editInvoice.id}/compose`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin/invoices', { preserveScroll: true });
    }

    function addRow() {
        form.setData('items', [
            ...(form.data.items ?? []),
            {
                key: randomKey(),
                description: '',
                quantity: '1',
                rate: '0.00',
            },
        ]);
    }

    function removeRow(key: string) {
        const rows = form.data.items ?? [];

        if (rows.length <= 1) {
            return;
        }

        form.setData(
            'items',
            rows.filter((row) => row.key !== key),
        );
    }

    function setLineField(
        lineKey: string,
        field: keyof Pick<FormLine, 'description' | 'quantity' | 'rate'>,
        value: string,
    ) {
        form.setData(
            'items',
            (form.data.items ?? []).map((row) =>
                row.key === lineKey ? { ...row, [field]: value } : row,
            ),
        );
    }

    async function downloadPreview(format: 'png' | 'pdf') {
        if (!showPreview) {
            toast.warning('Turn on preview to download.');

            return;
        }

        const el = pickFirstVisibleElement(
            previewMobileRef.current,
            previewDesktopRef.current,
        );

        if (!el) {
            toast.warning('Preview could not be captured yet.');

            return;
        }

        setDownloadWorking(true);

        try {
            await exportInvoicePreviewNode(el, {
                filenameBase: previewInvoice.invoice_number,
                format,
            });
            toast.success(
                format === 'png' ? 'PNG download started.' : 'PDF download started.',
            );
        } catch {
            toast.error('Could not create the file.');
        } finally {
            setDownloadWorking(false);
        }
    }

    const lineItems = form.data.items ?? [];

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Invoices', href: '/admin/invoices' },
                {
                    title: isEditing ? 'Edit invoice' : 'New invoice',
                    href: isEditing
                        ? `/admin/invoices/${editInvoice.id}/edit`
                        : '/admin/invoices/create',
                },
            ]}
        >
            <Head title={isEditing ? 'Edit invoice' : 'New invoice'} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Billing
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            {isEditing ? 'Edit invoice' : 'New invoice'}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {storeName}
                            </span>
                            {' · '}
                            Nigerian Naira (NGN). The preview updates as you type.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={showPreview}
                                onChange={(e) => setShowPreview(e.target.checked)}
                                className="rounded border-border"
                            />
                            Show preview
                        </label>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.processing}
                            onClick={() => postIntent('draft')}
                        >
                            <FileText className="size-4" />
                            Save draft
                        </Button>
                        <Button
                            type="button"
                            disabled={form.processing}
                            onClick={() => postIntent('send')}
                        >
                            <Send className="size-4" />
                            Send invoice
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        downloadWorking ||
                                        form.processing ||
                                        !showPreview
                                    }
                                >
                                    <Download className="size-4" />
                                    Download
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => void downloadPreview('png')}
                                >
                                    <FileImage className="size-4" />
                                    PNG image
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => void downloadPreview('pdf')}
                                >
                                    <FileText className="size-4" />
                                    PDF document
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div
                    className={cn(
                        'grid min-w-0 gap-6',
                        showPreview
                            ? 'lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]'
                            : 'grid-cols-1',
                    )}
                >
                    <div className="flex min-w-0 flex-col gap-6">
                        <Card className="border-sidebar-border/70 py-0 shadow-none">
                            <CardHeader className="border-b border-sidebar-border/70 py-6">
                                <p className="text-sm font-medium">Invoice details</p>
                            </CardHeader>
                            <CardContent className="space-y-6 py-6">
                                <FormSection>
                                    <FormField
                                        label="Bill to"
                                        htmlFor="customer_name"
                                        error={form.errors.customer_name}
                                    >
                                        <Input
                                            id="customer_name"
                                            value={form.data.customer_name}
                                            disabled={form.processing}
                                            placeholder="Company or customer name"
                                            onChange={(e) =>
                                                form.setData(
                                                    'customer_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormField>
                                    <FormField
                                        label="Email"
                                        htmlFor="customer_email"
                                        hint="Required to send the invoice."
                                        error={form.errors.customer_email}
                                    >
                                        <Input
                                            id="customer_email"
                                            type="email"
                                            value={form.data.customer_email}
                                            disabled={form.processing}
                                            onChange={(e) =>
                                                form.setData(
                                                    'customer_email',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormField>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            label="Invoice number"
                                            htmlFor="invoice_number"
                                            error={form.errors.invoice_number}
                                        >
                                            <Input
                                                id="invoice_number"
                                                className="font-mono text-sm"
                                                value={form.data.invoice_number}
                                                disabled={form.processing}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'invoice_number',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                        <FormField
                                            label="Due date"
                                            htmlFor="due_date"
                                            error={form.errors.due_date}
                                        >
                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={form.data.due_date}
                                                disabled={form.processing}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'due_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                    </div>
                                    <FormField
                                        label="Billing address"
                                        htmlFor="billing_address"
                                    >
                                        <Textarea
                                            id="billing_address"
                                            rows={3}
                                            value={form.data.billing_address}
                                            disabled={form.processing}
                                            placeholder="Street, city, country…"
                                            onChange={(e) =>
                                                form.setData(
                                                    'billing_address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormField>
                                </FormSection>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 py-0 shadow-none">
                            <CardHeader className="border-b border-sidebar-border/70 py-6">
                                <p className="text-sm font-medium">Line items</p>
                            </CardHeader>
                            <CardContent className="space-y-4 py-6">
                                <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                            <tr>
                                                <th className="px-3 py-2 font-medium">
                                                    Item
                                                </th>
                                                <th className="w-24 px-3 py-2 font-medium">
                                                    Qty
                                                </th>
                                                <th className="w-32 px-3 py-2 text-right font-medium">
                                                    Rate (₦)
                                                </th>
                                                <th className="w-12 px-3 py-2" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lineItems.map((row) => (
                                                <tr
                                                    key={row.key}
                                                    className="border-b border-sidebar-border/50 last:border-0"
                                                >
                                                    <td className="px-3 py-2">
                                                        <Input
                                                            value={row.description}
                                                            disabled={form.processing}
                                                            placeholder="Description"
                                                            onChange={(e) =>
                                                                setLineField(
                                                                    row.key,
                                                                    'description',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <Input
                                                            inputMode="decimal"
                                                            className="tabular-nums"
                                                            value={row.quantity}
                                                            disabled={form.processing}
                                                            onChange={(e) =>
                                                                setLineField(
                                                                    row.key,
                                                                    'quantity',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <Input
                                                            inputMode="decimal"
                                                            className="tabular-nums text-right"
                                                            value={row.rate}
                                                            disabled={form.processing}
                                                            onChange={(e) =>
                                                                setLineField(
                                                                    row.key,
                                                                    'rate',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={
                                                                form.processing ||
                                                                lineItems.length <= 1
                                                            }
                                                            onClick={() =>
                                                                removeRow(row.key)
                                                            }
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <InputError
                                    message={
                                        typeof form.errors.items === 'string'
                                            ? form.errors.items
                                            : undefined
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={form.processing}
                                    onClick={addRow}
                                >
                                    <Plus className="size-4" />
                                    Add line item
                                </Button>

                                <div className="grid gap-4 border-t border-sidebar-border/70 pt-6 sm:grid-cols-2">
                                    <FormField label="Discount (₦)" htmlFor="discount">
                                        <Input
                                            id="discount"
                                            inputMode="decimal"
                                            className="tabular-nums"
                                            value={form.data.discount}
                                            disabled={form.processing}
                                            onChange={(e) =>
                                                form.setData(
                                                    'discount',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormField>
                                    <FormField label="Tax (₦)" htmlFor="tax">
                                        <Input
                                            id="tax"
                                            inputMode="decimal"
                                            className="tabular-nums"
                                            value={form.data.tax}
                                            disabled={form.processing}
                                            onChange={(e) =>
                                                form.setData('tax', e.target.value)
                                            }
                                        />
                                    </FormField>
                                </div>
                                <FormField label="Notes" htmlFor="customer_note">
                                    <Textarea
                                        id="customer_note"
                                        rows={3}
                                        value={form.data.customer_note}
                                        disabled={form.processing}
                                        placeholder="Payment terms or a short memo…"
                                        onChange={(e) =>
                                            form.setData(
                                                'customer_note',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                            </CardContent>
                        </Card>

                        {showPreview ? (
                            <Card className="border-sidebar-border/70 py-0 shadow-none lg:hidden">
                                <CardHeader className="border-b border-sidebar-border/70 py-4">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Preview
                                    </p>
                                </CardHeader>
                                <CardContent className="py-6">
                                    <InvoiceDocumentPreview
                                        ref={previewMobileRef}
                                        invoice={previewInvoice}
                                    />
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>

                    {showPreview ? (
                        <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
                            <Card className="border-sidebar-border/70 py-0 shadow-none">
                                <CardHeader className="border-b border-sidebar-border/70 py-4">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Preview
                                    </p>
                                </CardHeader>
                                <CardContent className="py-6">
                                    <InvoiceDocumentPreview
                                        ref={previewDesktopRef}
                                        invoice={previewInvoice}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </div>

                {isEditing ? (
                    <p className="text-sm text-muted-foreground">
                        <Link
                            href={`/admin/invoices/${editInvoice.id}`}
                            className="underline-offset-4 hover:underline"
                        >
                            Back to invoice
                        </Link>
                    </p>
                ) : null}
            </div>
        </AdminLayout>
    );
}
