import type { CartItem } from '@/context/CartContext';
import type { StorefrontProduct } from '@/types/storefront-product';

export function storefrontProductToCartItem(
    product: StorefrontProduct,
    variantId?: string,
): Omit<CartItem, 'quantity'> {
    const variant =
        product.variants?.find((item) => item.id === variantId) ??
        product.variants?.[0];

    return {
        variantId: variant?.id ?? product.defaultVariantId ?? product.id,
        productId: product.id,
        name: product.name,
        variantName: variant?.name ?? 'Default',
        category: product.category,
        price: variant?.price ?? product.price,
        priceOnRequest: variant?.priceOnRequest ?? product.priceOnRequest,
        image: product.images[0]?.src ?? '',
        alt: product.images[0]?.alt ?? product.name,
    };
}

export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG')}`;
}
