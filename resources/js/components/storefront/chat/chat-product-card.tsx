import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { storefrontProductToCartItem } from '@/lib/cart';
import type { StorefrontProduct } from '@/types/storefront-product';

interface ChatProductCardProps {
    product: StorefrontProduct;
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
    const { addItem, openCart } = useCart();
    const { isWishlisted, toggle } = useWishlist();
    const [added, setAdded] = useState(false);
    const image = product.images[0];
    const wishlisted = isWishlisted(product.id);

    const handleAddToCart = () => {
        addItem(storefrontProductToCartItem(product));
        setAdded(true);
        openCart();
        window.setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '12px',
                padding: '10px',
                background: '#fafaf8',
                borderRadius: '10px',
                border: '1px solid #eee',
            }}
        >
            <Link
                href={product.href}
                style={{
                    flexShrink: 0,
                    width: '72px',
                    height: '96px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f0f0ee',
                }}
            >
                {image && (
                    <img
                        src={image.src}
                        alt={image.alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
                {product.brand && (
                    <p
                        style={{
                            margin: '0 0 4px',
                            fontSize: '9px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#999',
                        }}
                    >
                        {product.brand}
                    </p>
                )}
                <Link
                    href={product.href}
                    style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#060606',
                        textDecoration: 'none',
                        marginBottom: '4px',
                        lineHeight: 1.35,
                    }}
                >
                    {product.name}
                </Link>
                <p
                    style={{
                        margin: '0 0 10px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#060606',
                    }}
                >
                    {product.priceFormatted}
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                    }}
                >
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '9px',
                            fontWeight: 500,
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            padding: '7px 10px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: added ? '#2d6a4f' : '#060606',
                            color: '#fff',
                        }}
                    >
                        {added ? 'Added' : 'Add to cart'}
                    </button>
                    <button
                        type="button"
                        onClick={() => toggle(product.id)}
                        aria-label={
                            wishlisted
                                ? 'Remove from wishlist'
                                : 'Add to wishlist'
                        }
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '9px',
                            fontWeight: 500,
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            padding: '7px 10px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: '#fff',
                            color: wishlisted ? '#c41e3a' : '#060606',
                        }}
                    >
                        {wishlisted ? 'Saved' : 'Wishlist'}
                    </button>
                </div>
            </div>
        </div>
    );
}
