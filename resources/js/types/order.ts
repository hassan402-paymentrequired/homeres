import type { StockStatus } from '@/types/product';
import type { InvoiceStatus } from '@/types/invoice';

export type OrderInvoiceSummary = {
    id: string;
    invoice_number: string;
    status: InvoiceStatus;
    status_label: string;
};

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'fulfilled'
    | 'cancelled';

export type OrderStatusOption = {
    value: OrderStatus;
    label: string;
};

export type OrderSummary = {
    id: string;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    customer_name: string;
    customer_email: string;
    items_count: number;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    placed_at: string;
};

export type OrderItemRecord = {
    id: string;
    product_id: string | null;
    product_variant_id: string | null;
    product_name: string;
    variant_name: string;
    sku: string | null;
    stock_status: StockStatus;
    stock_status_label: string;
    unit_price: number | null;
    price_on_request: boolean;
    quantity: number;
    line_total: number | null;
};

export type OrderRecord = {
    id: string;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
    customer_note: string | null;
    admin_note: string | null;
    subtotal: number | null;
    shipping_total: number | null;
    total: number | null;
    has_price_on_request_items: boolean;
    currency: string;
    placed_at: string;
    items: OrderItemRecord[];
};

export type OrderBreadcrumb = {
    id: string;
    name: string;
    href: string;
};
