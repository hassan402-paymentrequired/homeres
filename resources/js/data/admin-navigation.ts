import {
    BarChart3,
    FileText,
    FolderTree,
    LayoutGrid,
    LayoutTemplate,
    Package,
    Settings,
    ShoppingBag,
    Tags,
} from 'lucide-react';
import type { AdminNavItem } from '@/types/admin';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutGrid,
        description: 'Overview and quick stats',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
        description: 'Manage collections and navigation',
    },
    {
        title: 'Brands',
        href: '/admin/brands',
        icon: Tags,
        description: 'Curate designer brands for the storefront directory',
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
        description: 'Catalog, pricing, and inventory',
    },
    {
        title: 'Product templates',
        href: '/admin/product-templates',
        icon: LayoutTemplate,
        description: 'Spec fields and variant options per product type',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
        description: 'Customer orders and fulfilment',
    },
    {
        title: 'Invoices',
        href: '/admin/invoices',
        icon: FileText,
        description: 'Billing and invoice records',
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        description: 'Sales and traffic insights',
    },
    // {
    //     title: 'Settings',
    //     href: '/admin/settings',
    //     icon: Settings,
    //     description: 'Store and admin configuration',
    // },
];
