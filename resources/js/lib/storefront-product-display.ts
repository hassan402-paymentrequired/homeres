import {
    primaryStorefrontImage,
    resolveStorefrontImageSrc,
} from '@/lib/storefront-image';
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

function galleryWithValidSrc(
    images: StorefrontProductImage[] | undefined,
): StorefrontProductImage[] {
    return (images ?? [])
        .map((image) => ({
            ...image,
            src: resolveStorefrontImageSrc(image.src),
        }))
        .filter((image) => image.src !== '');
}

export function resolveDisplayImages(
    product: StorefrontProduct,
    variant: StorefrontVariant | null,
): StorefrontProductImage[] {
    const variantImages = galleryWithValidSrc(variant?.images);

    if (variantImages.length > 0) {
        return variantImages;
    }

    return galleryWithValidSrc(product.images);
}

export function resolvePrimaryImageSrc(
    product: StorefrontProduct,
    variant: StorefrontVariant | null,
): string {
    const primary = primaryStorefrontImage(resolveDisplayImages(product, variant));

    return primary?.src ?? '';
}

export function variantOptionLabels(
    product: StorefrontProduct,
): Record<string, string> {
    const options = product.template?.variantOptions ?? [];

    return Object.fromEntries(
        options.map((field) => [field.key, field.label]),
    );
}
