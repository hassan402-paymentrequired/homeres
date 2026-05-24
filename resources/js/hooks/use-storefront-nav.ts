import { usePage } from '@inertiajs/react';
import type { StorefrontNavItem } from '@/types/storefront-navigation';

export function useStorefrontNav(): StorefrontNavItem[] {
    const { storefrontNav } = usePage<{ storefrontNav: StorefrontNavItem[] }>()
        .props;

    return storefrontNav ?? [];
}
