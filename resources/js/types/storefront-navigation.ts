export type NavLink = {
    label: string;
    handle: string;
};

export type NavColumn = {
    title?: string;
    titleHandle?: string;
    links: NavLink[];
};

export type StorefrontNavItem = {
    label: string;
    href?: string;
    handle?: string;
    columns?: NavColumn[];
    links?: NavLink[];
    brandGroups?: { title: string; links: NavLink[] }[];
};
