export type StorefrontProductImage = {
    src: string;
    alt: string;
};

export type StorefrontTemplateField = {
    key: string;
    label: string;
    type: string;
    required?: boolean;
    position?: number;
    options?: string[];
};

export type StorefrontProductTemplate = {
    slug: string;
    name: string;
    specFields: StorefrontTemplateField[];
    variantOptions: StorefrontTemplateField[];
    rules: {
        pricing_mode?: string;
        requires_brand?: boolean;
        min_images?: number;
        storefront_specs_title?: string | null;
        specs_layout?: 'single' | 'two_column';
        [key: string]: unknown;
    };
};

export type StorefrontProductSpec = {
    key: string;
    label: string;
    value: string;
    type: string;
};

export type StorefrontVariant = {
    id: string;
    name: string;
    sku: string | null;
    price: number | null;
    priceFormatted: string;
    priceOnRequest: boolean;
    stockStatus: string;
    stockStatusLabel: string;
    leadTimeDaysAir: number | null;
    leadTimeDaysSea: number | null;
    optionValues: Record<string, string>;
    images: StorefrontProductImage[];
};

export type StorefrontProduct = {
    id: string;
    handle: string;
    name: string;
    brand: string;
    brandHandle: string;
    price: number | null;
    priceFormatted: string;
    priceOnRequest: boolean;
    currency?: string;
    category: string;
    categorySlug: string;
    description: string;
    images: StorefrontProductImage[];
    isNew?: boolean;
    defaultVariantId?: string | null;
    href: string;
    template?: StorefrontProductTemplate | null;
    details?: string[];
    specs?: StorefrontProductSpec[];
    variants?: StorefrontVariant[];
    sku?: string | null;
    dimensions?: string | null;
    material?: string | null;
};
