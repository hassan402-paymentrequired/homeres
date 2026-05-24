import type {
    NavColumn,
    NavLink,
    StorefrontNavItem,
} from '@/types/storefront-navigation';

export type { NavColumn, NavLink, StorefrontNavItem };

export function collectionHref(handle: string): string {
    return `/collections/${handle}`;
}

export function brandHref(handle: string): string {
    return `/brands/${handle}`;
}

export function navItemHref(item: StorefrontNavItem): string {
    if (item.href) {
        return item.href;
    }

    if (item.handle) {
        return collectionHref(item.handle);
    }

    return '#';
}

export function navLinkHref(link: NavLink, item?: StorefrontNavItem): string {
    if (item?.brandGroups) {
        return brandHref(link.handle);
    }

    return collectionHref(link.handle);
}

export function hasDropdown(item: StorefrontNavItem): boolean {
    return Boolean(
        item.columns?.length ||
            item.links?.length ||
            item.brandGroups?.length,
    );
}
