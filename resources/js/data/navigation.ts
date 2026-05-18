import { CATEGORIES } from './categories';

export interface NavItem {
    label: string;
    href: string;
    hasDropdown?: boolean;
    children?: { label: string; href: string }[];
}

export const MAIN_NAV: NavItem[] = [
    { label: 'New Arrivals', href: '/shop/new-arrivals' },
    ...CATEGORIES.map((category) => ({
        label: category.label,
        href: `/shop/${category.slug}`,
        hasDropdown: Boolean(category.children?.length),
        children: category.children?.map((child) => ({
            label: child.label,
            href: `/shop/${category.slug}`,
        })),
    })),
    { label: 'Design Studio', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
];
