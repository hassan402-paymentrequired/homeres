export type ProductTemplateOption = {
    id: string;
    name: string;
};

export type CategoryRecord = {
    id: string;
    parent_id: string | null;
    product_template_id: string | null;
    name: string;
    description: string | null;
    banner_path?: string | null;
    banner_url?: string | null;
    nav_group_label: string | null;
    is_active: boolean;
    show_in_nav: boolean;
    product_template: ProductTemplateOption | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type CategoryCard = CategoryRecord & {
    children_count: number;
    product_count: number;
};

export type CategoryStats = {
    product_count: number;
    subcategories_count: number;
    active_subcategories_count: number;
    nav_visible_subcategories_count: number;
};

export type CategoryBreadcrumb = {
    id: string;
    name: string;
    href: string;
};
