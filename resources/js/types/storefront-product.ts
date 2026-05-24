export type StorefrontProductImage = {
    src: string;
    alt: string;
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
    category: string;
    categorySlug: string;
    description: string;
    images: StorefrontProductImage[];
    isNew?: boolean;
    defaultVariantId?: string | null;
    href: string;
    details?: string[];
    variants?: StorefrontVariant[];
    sku?: string | null;
    dimensions?: string | null;
    material?: string | null;
};
