export type InvoiceComposeLine = {
    description: string;
    quantity: string;
    unit_price: number;
};

export type InvoicePrefill = {
    order_id: string | null;
    invoice_number: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    billing_address: string | null;
    billing_city: string | null;
    billing_state: string | null;
    due_date: string | null;
    discount: number;
    tax: number;
    customer_note: string | null;
    lines: InvoiceComposeLine[];
};

export type InvoiceEditPayload = {
    id: string;
    invoice_number: string;
    order_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    billing_address: string | null;
    billing_city: string | null;
    billing_state: string | null;
    due_date: string | null;
    discount: number;
    tax: number;
    customer_note: string | null;
    lines: InvoiceComposeLine[];
};

export type InvoiceComposeBreadcrumb = {
    id: string;
    name: string;
    href: string;
};
