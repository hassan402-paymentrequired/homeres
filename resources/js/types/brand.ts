export type BrandRecord = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    show_in_nav: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type BrandCard = BrandRecord & {
    product_count: number;
};

export type BrandStats = {
    product_count: number;
};

export type BrandBreadcrumb = {
    id: string;
    name: string;
    href: string;
};
