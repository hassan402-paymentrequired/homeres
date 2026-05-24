import type {
    StorefrontProduct,
    StorefrontProductImage,
    StorefrontVariant,
} from '@/types/storefront-product';

export function resolveSelectedVariant(
    product: StorefrontProduct,
    selectedVariantId: string | null,
): StorefrontVariant | null {
    const variants = product.variants ?? [];

    if (variants.length === 0) {
        return null;
    }

    return (
        variants.find((variant) => variant.id === selectedVariantId) ??
        variants.find((variant) => variant.id === product.defaultVariantId) ??
        variants[0]
    );
}

export function resolveDisplayImages(
    product: StorefrontProduct,
    variant: StorefrontVariant | null,
): StorefrontProductImage[] {
    if (variant?.images?.length) {
        return variant.images;
    }

    return product.images;
}

export function variantOptionLabels(
    product: StorefrontProduct,
): Record<string, string> {
    const options = product.template?.variantOptions ?? [];

    return Object.fromEntries(
        options.map((field) => [field.key, field.label]),
    );
}
