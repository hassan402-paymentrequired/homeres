import { forwardRef } from 'react';
import { CURRENCY_SYMBOL, formatNgn } from '@/lib/currency';
import { cn } from '@/lib/utils';

export type InvoicePreviewLine = {
    description: string;
    quantity: string;
    unit_price_display: string;
    line_total_display: string;
};

export type InvoicePreviewPayload = {
    invoice_number: string;
    store_name: string;
    customer_name: string;
    customer_email: string | null;
    billing_address: string | null;
    due_date: string | null;
    lines: InvoicePreviewLine[];
    subtotal_display: string;
    discount_display: string;
    tax_display: string;
    total_display: string;
    shipping_display?: string;
    customer_note?: string | null;
    payment_instructions?: string | null;
};

export function amountToDisplay(amount: number): string {
    return formatNgn(amount);
}

type Props = {
    invoice: InvoicePreviewPayload;
    className?: string;
};

const InvoiceDocumentPreview = forwardRef<HTMLDivElement, Props>(
    function InvoiceDocumentPreview({ invoice, className }, ref) {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl border border-sidebar-border/70 bg-card p-4 text-foreground shadow-none ring-1 ring-black/[0.06] sm:p-6 md:p-8',
                    className,
                )}
            >
                <div className="flex flex-col gap-4 border-b border-sidebar-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between sm:pb-6">
                    <div className="min-w-0">
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Invoice
                        </p>
                        <p className="mt-2 font-mono text-base font-semibold tabular-nums sm:text-lg">
                            {invoice.invoice_number}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {invoice.store_name}
                        </p>
                    </div>
                    <div className="text-left text-sm sm:text-right">
                        {invoice.due_date ? (
                            <>
                                <p className="font-medium tracking-wide text-muted-foreground uppercase">
                                    Due date
                                </p>
                                <p className="mt-1 tabular-nums">{invoice.due_date}</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No due date</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-5 py-5 sm:grid-cols-2 sm:gap-6 sm:py-6">
                    <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Billed to
                        </p>
                        <p className="mt-2 font-semibold">{invoice.customer_name}</p>
                        {invoice.customer_email ? (
                            <p className="mt-1 text-sm break-all text-muted-foreground">
                                {invoice.customer_email}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Address
                        </p>
                        <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                            {invoice.billing_address?.trim()
                                ? invoice.billing_address
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className="-mx-1 overflow-x-auto px-1">
                    <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b text-[10px] font-medium tracking-wide uppercase sm:text-xs">
                                <th className="py-2 pr-2 text-muted-foreground sm:py-3">
                                    Items
                                </th>
                                <th className="py-2 pr-2 text-center text-muted-foreground sm:py-3">
                                    Qty
                                </th>
                                <th className="py-2 pr-2 text-right text-muted-foreground sm:py-3">
                                    Rate
                                </th>
                                <th className="py-2 text-right text-muted-foreground sm:py-3">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.lines.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No line items yet
                                    </td>
                                </tr>
                            ) : (
                                invoice.lines.map((line, idx) => (
                                    <tr
                                        key={`${idx}-${line.description}`}
                                        className="border-b border-dashed border-sidebar-border/50"
                                    >
                                        <td className="max-w-[40vw] py-2 pr-2 align-top font-medium break-words sm:max-w-none sm:py-3">
                                            {line.description || '—'}
                                        </td>
                                        <td className="py-2 pr-2 text-center tabular-nums sm:py-3">
                                            {line.quantity}
                                        </td>
                                        <td className="py-2 pr-2 text-right whitespace-nowrap tabular-nums sm:py-3">
                                            {CURRENCY_SYMBOL}
                                            {line.unit_price_display}
                                        </td>
                                        <td className="py-2 text-right font-medium whitespace-nowrap tabular-nums sm:py-3">
                                            {CURRENCY_SYMBOL}
                                            {line.line_total_display}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 ml-auto flex w-full max-w-xs flex-col gap-2 border-t border-sidebar-border/70 pt-5 text-sm sm:mt-6 sm:pt-6">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="tabular-nums">
                            {CURRENCY_SYMBOL}
                            {invoice.subtotal_display}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="tabular-nums">
                            {CURRENCY_SYMBOL}
                            {invoice.discount_display}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="tabular-nums">
                            {CURRENCY_SYMBOL}
                            {invoice.tax_display}
                        </span>
                    </div>
                    {invoice.shipping_display &&
                    invoice.shipping_display !== '—' &&
                    invoice.shipping_display !== '0.00' ? (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="tabular-nums">
                                {CURRENCY_SYMBOL}
                                {invoice.shipping_display}
                            </span>
                        </div>
                    ) : null}
                    <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-base font-semibold">
                        <span>Total</span>
                        <span className="tabular-nums">
                            {CURRENCY_SYMBOL}
                            {invoice.total_display}
                        </span>
                    </div>
                </div>

                {invoice.customer_note?.trim() ? (
                    <div className="mt-8 border-t border-sidebar-border/70 pt-6 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Notes</p>
                        <p className="mt-2 whitespace-pre-wrap">
                            {invoice.customer_note}
                        </p>
                    </div>
                ) : null}

                {invoice.payment_instructions?.trim() ? (
                    <div className="mt-8 border-t border-sidebar-border/70 pt-6 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">
                            Payment instructions
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                            {invoice.payment_instructions}
                        </p>
                    </div>
                ) : null}
            </div>
        );
    },
);

export default InvoiceDocumentPreview;
