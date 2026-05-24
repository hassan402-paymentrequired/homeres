export type ProductImage = {
    id: string;
    path: string | null;
    url: string;
    alt: string;
    position: number;
};

export type ProductPublishStatus = 'published' | 'draft';

export type StockStatus = 'in_store' | 'in_stock_remote' | 'out_of_stock';

export type ProductTemplateField = {
    key: string;
    label: string;
    type: string;
    required?: boolean;
    position?: number;
    options?: string[];
};

export type ProductTemplateRules = {
    pricing_mode?: 'fixed' | 'on_request';
    requires_brand?: boolean;
    min_images?: number;
};

export type ProductTemplateSummary = {
    id: string;
    name: string;
    slug: string;
    spec_fields: ProductTemplateField[];
    variant_options: ProductTemplateField[];
    rules: ProductTemplateRules;
};

export type ProductCategoryOption = {
    id: string;
    name: string;
    product_template: ProductTemplateSummary | null;
};

export type BrandOption = {
    id: string;
    name: string;
};

export type ProductRecord = {
    id: string;
    category_id: string;
    brand_id: string | null;
    name: string;
    description: string | null;
    specs: Record<string, string>;
    status: ProductPublishStatus;
    is_active: boolean;
    images: ProductImage[];
    category: { id: string; name: string } | null;
    brand: { id: string; name: string } | null;
    product_template: ProductTemplateSummary | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ProductCard = {
    id: string;
    name: string;
    status: ProductPublishStatus;
    is_active: boolean;
    thumbnail_url: string | null;
    category: { id: string; name: string } | null;
    brand: { id: string; name: string } | null;
    variants_count: number;
};

export type ProductVariantRecord = {
    id: string;
    name: string;
    sku: string | null;
    option_values: Record<string, string>;
    price: string | null;
    price_on_request: boolean;
    stock_status: StockStatus;
    lead_time_days_air: number | null;
    lead_time_days_sea: number | null;
    weight_kg: string | null;
    quantity: number | null;
    is_active: boolean;
};

export type ProductVariantCard = {
    id: string;
    name: string;
    sku: string | null;
    price: string | null;
    price_on_request: boolean;
    stock_status: StockStatus;
    stock_status_label: string;
    lead_time_days_air: number | null;
    lead_time_days_sea: number | null;
    weight_kg: string | null;
    quantity: number | null;
    is_active: boolean;
};

export type ProductStats = {
    variants_count: number;
    in_store_count: number;
    remote_stock_count: number;
    out_of_stock_count: number;
};

export type ProductBreadcrumb = {
    id: string;
    name: string;
    href: string;
};

export type StockStatusOption = {
    value: StockStatus;
    label: string;
};
