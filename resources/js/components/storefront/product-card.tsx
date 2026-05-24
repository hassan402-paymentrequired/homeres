import { Link } from '@inertiajs/react';
import { useState } from 'react';
import QuickShopPanel from '@/components/storefront/quick-shop-panel';
import { useWishlist } from '@/context/WishlistContext';
import type { StorefrontProduct } from '@/types/storefront-product';
import ProductQuickView, {
    type QuickViewProduct,
} from '@/pages/landing/components/product-quick-view';

interface ProductCardProps {
    product: StorefrontProduct;
    index?: number;
    animate?: boolean;
    visible?: boolean;
}

export function toQuickViewProduct(product: StorefrontProduct): QuickViewProduct {
    return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.priceFormatted,
        image: product.images[0]?.src ?? '',
        alt: product.images[0]?.alt ?? product.name,
        href: product.href,
        isNew: product.isNew,
        category: product.category,
        description: product.description,
    };
}

export default function ProductCard({
    product,
    index = 0,
    animate = false,
    visible = true,
}: ProductCardProps) {
    const [hovered, setHovered] = useState(false);
    const [quickView, setQuickView] = useState<QuickViewProduct | null>(null);
    const [quickShopOpen, setQuickShopOpen] = useState(false);
    const { isWishlisted, toggle } = useWishlist();
    const image = product.images[0];
    const wishlisted = isWishlisted(product.id);

    return (
        <>
            <div
                style={{
                    opacity: animate ? (visible ? 1 : 0) : 1,
                    transform: animate
                        ? visible
                            ? 'translateY(0)'
                            : 'translateY(20px)'
                        : undefined,
                    transition: animate
                        ? `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`
                        : undefined,
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        aspectRatio: '3/4',
                        background: '#f5f5f3',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => {
                        setHovered(false);
                        setQuickShopOpen(false);
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
                                transition: 'transform 0.6s ease',
                                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                            }}
                        />
                    )}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            toggle(product.id);
                        }}
                        aria-label={
                            wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                        }
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: wishlisted ? '#c41e3a' : '#060606',
                        }}
                    >
                        {wishlisted ? '♥' : '♡'}
                    </button>
                    {product.isNew && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: '#060606',
                                color: '#ffffff',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                padding: '4px 8px',
                            }}
                        >
                            New
                        </span>
                    )}
                    {hovered && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                padding: quickShopOpen ? 0 : '12px',
                            }}
                        >
                            {!quickShopOpen ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setQuickShopOpen(true)}
                                        style={{
                                            background: '#060606',
                                            color: '#fff',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            padding: '9px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            width: '100%',
                                        }}
                                    >
                                        Quick shop
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuickView(toQuickViewProduct(product))
                                        }
                                        style={{
                                            background: 'rgba(255,255,255,0.92)',
                                            color: '#060606',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            padding: '9px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            width: '100%',
                                        }}
                                    >
                                        Quick view
                                    </button>
                                </>
                            ) : (
                                <QuickShopPanel
                                    product={product}
                                    onClose={() => setQuickShopOpen(false)}
                                />
                            )}
                        </div>
                    )}
                </div>
                <Link
                    href={product.href}
                    style={{ textDecoration: 'none', display: 'block' }}
                >
                    {(product.brand || product.category) && (
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                fontWeight: 400,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                color: '#999',
                                margin: '0 0 6px',
                            }}
                        >
                            {[product.brand, product.category]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    )}
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            fontWeight: 300,
                            color: '#060606',
                            margin: '0 0 4px',
                        }}
                    >
                        {product.name}
                    </p>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#060606',
                            margin: 0,
                        }}
                    >
                        {product.priceFormatted}
                    </p>
                </Link>
            </div>
            <ProductQuickView
                product={quickView}
                onClose={() => setQuickView(null)}
            />
        </>
    );
}
