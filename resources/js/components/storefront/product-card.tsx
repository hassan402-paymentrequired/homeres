import { Link } from '@inertiajs/react';
import { useState } from 'react';
import type { MockProduct } from '@/data/mock-products';
import ProductQuickView, {
    type QuickViewProduct,
} from '@/pages/landing/components/product-quick-view';

interface ProductCardProps {
    product: MockProduct;
    index?: number;
    animate?: boolean;
    visible?: boolean;
}

export function toQuickViewProduct(product: MockProduct): QuickViewProduct {
    return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.priceFormatted,
        image: product.images[0]?.src ?? '',
        alt: product.images[0]?.alt ?? product.name,
        href: `/products/${product.id}`,
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
    const image = product.images[0];

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
                    onMouseLeave={() => setHovered(false)}
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
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '12px',
                            opacity: hovered ? 1 : 0,
                            transform: hovered
                                ? 'translateY(0)'
                                : 'translateY(8px)',
                            transition: 'all 0.25s ease',
                        }}
                    >
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
                            Quick View
                        </button>
                    </div>
                </div>
                <Link
                    href={`/products/${product.id}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                >
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
