import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ImageLightbox from '@/components/storefront/image-lightbox';
import ProductCard from '@/components/storefront/product-card';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { useCart } from '@/context/CartContext';
import {
    getProductById,
    getRelatedProducts,
} from '@/data/mock-products';
import { mockProductToCartItem } from '@/lib/cart';
interface ProductShowProps {
    id: string;
}

export default function ProductDetailsPage({ id }: ProductShowProps) {
    const product = getProductById(id);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const { addItem, openCart } = useCart();

    if (!product) {
        return (
            <StorefrontShell>
                <Head title="Product Not Found" />
                <div style={{ padding: '80px 30px', textAlign: 'center' }}>
                    <h1
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '24px',
                            marginBottom: '12px',
                        }}
                    >
                        Product not found
                    </h1>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: '#6b6b6b',
                            marginBottom: '24px',
                        }}
                    >
                        This sample product is not in the preview catalogue.
                    </p>
                    <Link href="/shop" style={{ color: '#060606' }}>
                        Browse all products
                    </Link>
                </div>
            </StorefrontShell>
        );
    }

    const related = getRelatedProducts(product);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(mockProductToCartItem(product));
        }

        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            openCart();
        }, 800);
    };

    return (
        <StorefrontShell>
            <Head title={product.name} />
            <div
                style={{
                    maxWidth: '1500px',
                    margin: '0 auto',
                    padding: '16px 30px',
                    borderBottom: '1px solid #f0f0ec',
                }}
            >
                <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[
                        { label: 'Home', href: '/' },
                        { label: product.category, href: `/shop/${product.categorySlug}` },
                        { label: product.name, href: '#' },
                    ].map((crumb, i, arr) => (
                        <span key={crumb.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {i < arr.length - 1 ? (
                                <>
                                    <Link
                                        href={crumb.href}
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            color: '#999',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {crumb.label}
                                    </Link>
                                    <span style={{ color: '#ccc' }}>/</span>
                                </>
                            ) : (
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '11px',
                                        color: '#060606',
                                    }}
                                >
                                    {crumb.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '48px 30px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 480px',
                        gap: '64px',
                        alignItems: 'start',
                    }}
                    className="product-layout"
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '72px' }}>
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    style={{
                                        width: '72px',
                                        height: '88px',
                                        border: activeImage === i ? '2px solid #060606' : '2px solid transparent',
                                        padding: 0,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                            <div
                                style={{
                                    flex: 1,
                                    aspectRatio: '3/4',
                                    background: '#f5f5f3',
                                    position: 'relative',
                                    cursor: 'zoom-in',
                                }}
                                onClick={() => setLightboxOpen(true)}
                            >
                                <img
                                    src={product.images[activeImage]?.src}
                                    alt={product.images[activeImage]?.alt}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            {product.isNew && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        background: '#060606',
                                        color: '#fff',
                                        fontSize: '10px',
                                        padding: '4px 10px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    New
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ position: 'sticky', top: '80px' }}>
                        <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', margin: '0 0 10px' }}>
                            {product.category}
                        </p>
                        <h1 style={{ fontFamily: '"Proza Libre", sans-serif', fontSize: '32px', margin: '0 0 12px' }}>
                            {product.name}
                        </h1>
                        <p style={{ fontFamily: '"Proza Libre", sans-serif', fontSize: '26px', margin: '0 0 24px' }}>
                            {product.priceFormatted}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: 1.8, marginBottom: '28px' }}>
                            {product.description}
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                Quantity
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e1', width: 'fit-content' }}>
                                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: '44px', height: '44px', border: 'none', background: 'none', cursor: 'pointer' }}>−</button>
                                <span style={{ width: '52px', textAlign: 'center' }}>{quantity}</span>
                                <button type="button" onClick={() => setQuantity((q) => q + 1)} style={{ width: '44px', height: '44px', border: 'none', background: 'none', cursor: 'pointer' }}>+</button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            style={{
                                width: '100%',
                                background: added ? '#1a7a3c' : '#060606',
                                color: '#fff',
                                padding: '16px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                marginBottom: '32px',
                            }}
                        >
                            {added ? 'Added to Bag (preview)' : 'Add to Bag'}
                        </button>

                        <div style={{ borderTop: '1px solid #f0f0ec', paddingTop: '24px' }}>
                            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '14px' }}>
                                Product Details
                            </p>
                            <ul style={{ paddingLeft: '16px', margin: 0 }}>
                                {product.details.map((d) => (
                                    <li key={d} style={{ fontSize: '12px', color: '#6b6b6b', marginBottom: '6px' }}>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <div style={{ borderTop: '1px solid #f0f0ec', padding: '64px 30px', maxWidth: '1500px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: '"Proza Libre", sans-serif', fontSize: '22px', marginBottom: '32px' }}>
                        You May Also Like
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="related-grid">
                        {related.map((rp, idx) => (
                            <ProductCard key={rp.id} product={rp} index={idx} />
                        ))}
                    </div>
                </div>
            )}

            {lightboxOpen && product.images[activeImage] && (
                <ImageLightbox
                    src={product.images[activeImage].src}
                    alt={product.images[activeImage].alt}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <div
                className="pdp-mobile-bar"
                style={{
                    display: 'none',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 20px',
                    background: '#fff',
                    borderTop: '1px solid #e8e8e1',
                    zIndex: 40,
                }}
            >
                <button
                    type="button"
                    onClick={handleAddToCart}
                    style={{
                        width: '100%',
                        background: '#060606',
                        color: '#fff',
                        padding: '14px',
                        border: 'none',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}
                >
                    Add to bag
                </button>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .product-layout { grid-template-columns: 1fr !important; }
                    .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .pdp-mobile-bar { display: block !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
