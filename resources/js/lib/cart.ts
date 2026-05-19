import type { CartItem } from '@/context/CartContext';
import type { MockProduct } from '@/data/mock-products';

export function mockProductToCartItem(
    product: MockProduct,
): Omit<CartItem, 'quantity'> {
    return {
        id: product.id,
        category: product.category,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src ?? '',
        alt: product.images[0]?.alt ?? product.name,
    };
}

export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG')}`;
}
