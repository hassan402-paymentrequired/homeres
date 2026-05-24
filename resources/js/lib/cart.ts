import type { CartItem } from '@/context/CartContext';
import type {
    StorefrontProduct,
    StorefrontProductImage,
} from '@/types/storefront-product';
import { resolveStorefrontImageSrc } from '@/lib/storefront-image';
import {
    resolveDisplayImages,
    resolvePrimaryImageSrc,
    resolveSelectedVariant,
} from '@/lib/storefront-product-display';

export function storefrontProductToCartItem(
    product: StorefrontProduct,
    variantId?: string,
    images?: StorefrontProductImage[],
): Omit<CartItem, 'quantity'> {
    const variant = resolveSelectedVariant(product, variantId ?? null);
    const gallery = images ?? resolveDisplayImages(product, variant);
    const primary =
        gallery.find((image) => resolveStorefrontImageSrc(image.src) !== '') ??
        gallery[0];

    return {
        variantId: variant?.id ?? product.defaultVariantId ?? product.id,
        productId: product.id,
        name: product.name,
        variantName: variant?.name ?? 'Default',
        category: product.category,
        price: variant?.price ?? product.price,
        priceOnRequest: variant?.priceOnRequest ?? product.priceOnRequest,
        image: resolveStorefrontImageSrc(
            primary?.src ?? resolvePrimaryImageSrc(product, variant),
        ),
        alt: primary?.alt ?? product.name,
    };
}

export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG')}`;
}
