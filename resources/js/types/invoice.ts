export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'void';

export type InvoiceStatusOption = {
    value: InvoiceStatus;
    label: string;
};

export type InvoiceSummary = {
    id: string;
    invoice_number: string;
    status: InvoiceStatus;
    status_label: string;
    customer_name: string;
    customer_email: string;
    order_id: string | null;
    order_number: string | null;
    items_count: number;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    issued_at: string | null;
    due_at: string | null;
    paid_at: string | null;
};

export type InvoiceItemRecord = {
    id: string;
    product_name: string;
    variant_name: string;
    sku: string | null;
    unit_price: number | null;
    price_on_request: boolean;
    quantity: number;
    line_total: number | null;
};

export type InvoiceRecord = {
    id: string;
    invoice_number: string;
    status: InvoiceStatus;
    status_label: string;
    order_id: string | null;
    order_number: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    billing_address: string | null;
    billing_city: string | null;
    billing_state: string | null;
    customer_note: string | null;
    admin_note: string | null;
    subtotal: number | null;
    discount: number;
    tax: number;
    shipping_total: number | null;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    issued_at: string | null;
    due_at: string | null;
    paid_at: string | null;
    items: InvoiceItemRecord[];
};

export type InvoiceBreadcrumb = {
    id: string;
    name: string;
    href: string;
};
