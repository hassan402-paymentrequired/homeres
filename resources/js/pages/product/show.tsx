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

            <section className="pdp-viewport">
                <nav className="pdp-breadcrumbs">
                    {[
                        { label: 'Home', href: '/' },
                        { label: product.category, href: `/shop/${product.categorySlug}` },
                        { label: product.name, href: '#' },
                    ].map((crumb, i, arr) => (
                        <span key={crumb.label} className="pdp-crumb">
                            {i < arr.length - 1 ? (
                                <>
                                    <Link href={crumb.href} className="pdp-crumb-link">
                                        {crumb.label}
                                    </Link>
                                    <span className="pdp-crumb-sep">/</span>
                                </>
                            ) : (
                                <span className="pdp-crumb-current">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>

                <div className="pdp-layout">
                    <div className="pdp-gallery">
                        <div className="pdp-thumbs">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    className={`pdp-thumb${activeImage === i ? ' pdp-thumb--active' : ''}`}
                                >
                                    <img src={img.src} alt={img.alt} />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="pdp-main-image"
                            onClick={() => setLightboxOpen(true)}
                            aria-label="Open image zoom"
                        >
                            <img
                                src={product.images[activeImage]?.src}
                                alt={product.images[activeImage]?.alt}
                            />
                            {product.isNew && <span className="pdp-new-badge">New</span>}
                        </button>
                    </div>

                    <div className="pdp-info">
                        <p className="pdp-category">{product.category}</p>
                        <h1 className="pdp-title">{product.name}</h1>
                        <p className="pdp-price">{product.priceFormatted}</p>
                        <p className="pdp-description">{product.description}</p>

                        <div className="pdp-quantity">
                            <p className="pdp-label">Quantity</p>
                            <div className="pdp-qty-control">
                                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                                <span>{quantity}</span>
                                <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="pdp-add-btn"
                            style={{ background: added ? '#1a7a3c' : '#060606' }}
                        >
                            {added ? 'Added to Bag (preview)' : 'Add to Bag'}
                        </button>

                        <div className="pdp-details">
                            <p className="pdp-label">Product Details</p>
                            <ul>
                                {product.details.map((d) => (
                                    <li key={d}>{d}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <div className="pdp-related">
                    <h2>You May Also Like</h2>
                    <div className="pdp-related-grid">
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

            <div className="pdp-mobile-bar">
                <button type="button" onClick={handleAddToCart}>
                    Add to bag
                </button>
            </div>

            <style>{`
                .pdp-viewport {
                    --pdp-top-offset: 148px;
                    max-width: 1500px;
                    margin: 0 auto;
                    padding: 12px 30px 20px;
                    height: calc(100dvh - var(--pdp-top-offset));
                    min-height: 520px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-bottom: 1px solid #f0f0ec;
                }

                .pdp-breadcrumbs {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    flex-shrink: 0;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f0f0ec;
                }

                .pdp-crumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pdp-crumb-link,
                .pdp-crumb-current {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    text-decoration: none;
                }

                .pdp-crumb-link { color: #999; }
                .pdp-crumb-current { color: #060606; }
                .pdp-crumb-sep { color: #ccc; }

                .pdp-layout {
                    flex: 1;
                    min-height: 0;
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
                    gap: 40px;
                    align-items: stretch;
                }

                .pdp-gallery {
                    display: flex;
                    gap: 14px;
                    min-height: 0;
                    height: 100%;
                }

                .pdp-thumbs {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    width: 64px;
                    flex-shrink: 0;
                    overflow-y: auto;
                }

                .pdp-thumb {
                    width: 64px;
                    height: 76px;
                    flex-shrink: 0;
                    border: 2px solid transparent;
                    padding: 0;
                    cursor: pointer;
                    overflow: hidden;
                    background: none;
                }

                .pdp-thumb--active { border-color: #060606; }

                .pdp-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .pdp-main-image {
                    flex: 1;
                    min-width: 0;
                    min-height: 0;
                    position: relative;
                    background: #f5f5f3;
                    border: none;
                    padding: 0;
                    cursor: zoom-in;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pdp-main-image img {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                    display: block;
                }

                .pdp-new-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: #060606;
                    color: #fff;
                    font-size: 10px;
                    padding: 4px 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .pdp-info {
                    min-height: 0;
                    overflow-y: auto;
                    padding-right: 4px;
                }

                .pdp-category {
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #999;
                    margin: 0 0 8px;
                }

                .pdp-title {
                    font-family: "Proza Libre", sans-serif;
                    font-size: clamp(22px, 2.4vw, 28px);
                    line-height: 1.2;
                    margin: 0 0 8px;
                }

                .pdp-price {
                    font-family: "Proza Libre", sans-serif;
                    font-size: clamp(20px, 2vw, 24px);
                    margin: 0 0 16px;
                }

                .pdp-description {
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                    color: #6b6b6b;
                    line-height: 1.65;
                    margin: 0 0 20px;
                }

                .pdp-label {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin: 0 0 8px;
                }

                .pdp-quantity { margin-bottom: 16px; }

                .pdp-qty-control {
                    display: flex;
                    align-items: center;
                    border: 1px solid #e8e8e1;
                    width: fit-content;
                }

                .pdp-qty-control button {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                }

                .pdp-qty-control span {
                    width: 48px;
                    text-align: center;
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                }

                .pdp-add-btn {
                    width: 100%;
                    color: #fff;
                    padding: 14px;
                    border: none;
                    cursor: pointer;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                }

                .pdp-details {
                    border-top: 1px solid #f0f0ec;
                    padding-top: 16px;
                }

                .pdp-details ul {
                    padding-left: 16px;
                    margin: 0;
                }

                .pdp-details li {
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    color: #6b6b6b;
                    margin-bottom: 4px;
                    line-height: 1.5;
                }

                .pdp-related {
                    border-top: 1px solid #f0f0ec;
                    padding: 56px 30px 80px;
                    max-width: 1500px;
                    margin: 0 auto;
                }

                .pdp-related h2 {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 22px;
                    margin: 0 0 32px;
                }

                .pdp-related-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                }

                .pdp-mobile-bar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 12px 20px;
                    background: #fff;
                    border-top: 1px solid #e8e8e1;
                    z-index: 40;
                }

                .pdp-mobile-bar button {
                    width: 100%;
                    background: #060606;
                    color: #fff;
                    padding: 14px;
                    border: none;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    cursor: pointer;
                }

                @media (max-width: 900px) {
                    .pdp-viewport {
                        height: auto;
                        min-height: 0;
                        overflow: visible;
                    }

                    .pdp-layout {
                        grid-template-columns: 1fr;
                        height: auto;
                    }

                    .pdp-gallery {
                        flex-direction: column-reverse;
                        height: auto;
                    }

                    .pdp-thumbs {
                        flex-direction: row;
                        width: 100%;
                        overflow-x: auto;
                        overflow-y: hidden;
                    }

                    .pdp-main-image {
                        min-height: 0;
                        max-height: 55vh;
                        aspect-ratio: 4 / 5;
                    }

                    .pdp-info {
                        overflow: visible;
                    }

                    .pdp-related-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .pdp-mobile-bar {
                        display: block;
                    }
                }
            `}</style>
        </StorefrontShell>
    );
}
