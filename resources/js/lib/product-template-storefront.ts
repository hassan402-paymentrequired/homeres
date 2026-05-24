import type { ProductTemplateSpecsLayout } from '@/types/product';
import type { StorefrontProductTemplate } from '@/types/storefront-product';

export function resolveStorefrontSpecsTitle(
    template: StorefrontProductTemplate | null | undefined,
): string {
    const custom = template?.rules?.storefront_specs_title;

    if (typeof custom === 'string' && custom.trim() !== '') {
        return custom.trim();
    }

    if (template?.name?.trim()) {
        return template.name.trim();
    }

    return 'Product details';
}

export function resolveStorefrontSpecsLayout(
    template: StorefrontProductTemplate | null | undefined,
): ProductTemplateSpecsLayout {
    const layout = template?.rules?.specs_layout;

    return layout === 'two_column' ? 'two_column' : 'single';
}
