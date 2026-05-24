export type BrandNavGroupOption = {
    id: string;
    name: string;
};

export type BrandNavGroupSummary = BrandRecord & {
    children_count: number;
};

export type BrandRecord = {
    id: string;
    parent_id: string | null;
    is_parent: boolean;
    name: string;
    description: string | null;
    is_active: boolean;
    show_in_nav: boolean;
    parent?: BrandNavGroupOption | null;
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
