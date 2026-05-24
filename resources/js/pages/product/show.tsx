import { Head, Link } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ImageLightbox from '@/components/storefront/image-lightbox';
import ProductCard from '@/components/storefront/product-card';
import ProductTemplateSpecs from '@/components/storefront/product-template-specs';
import ProductVariantPicker from '@/components/storefront/product-variant-picker';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { useCart } from '@/context/CartContext';
import { storefrontProductToCartItem } from '@/lib/cart';
import {
    resolveDisplayImages,
    resolveSelectedVariant,
    variantOptionLabels,
} from '@/lib/storefront-product-display';
import type { StorefrontProduct } from '@/types/storefront-product';

interface ProductShowProps {
    product: StorefrontProduct | null;
    relatedProducts: StorefrontProduct[];
}

export default function ProductDetailsPage({
    product,
    relatedProducts,
}: ProductShowProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        product?.defaultVariantId ?? product?.variants?.[0]?.id ?? null,
    );
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const { addItem, openCart } = useCart();

    const selectedVariant = useMemo(
        () => (product ? resolveSelectedVariant(product, selectedVariantId) : null),
        [product, selectedVariantId],
    );

    const displayImages = useMemo(
        () => (product ? resolveDisplayImages(product, selectedVariant) : []),
        [product, selectedVariant],
    );

    const optionLabels = useMemo(
        () => (product ? variantOptionLabels(product) : {}),
        [product],
    );

    useEffect(() => {
        setActiveImage(0);
    }, [selectedVariantId]);

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

    const related = relatedProducts;
    const displayPrice =
        selectedVariant?.priceFormatted ?? product.priceFormatted;
    const priceOnRequest =
        selectedVariant?.priceOnRequest ?? product.priceOnRequest;
    const displaySku = selectedVariant?.sku ?? product.sku;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(
                storefrontProductToCartItem(
                    product,
                    selectedVariant?.id,
                    displayImages,
                ),
            );
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
                        <div className="pdp-thumbs" role="tablist" aria-label="Product images">
                            {displayImages.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeImage === i}
                                    aria-label={`View image ${i + 1}`}
                                    onClick={() => setActiveImage(i)}
                                    className={`pdp-thumb${activeImage === i ? ' pdp-thumb--active' : ''}`}
                                >
                                    <img src={img.src} alt={img.alt} draggable={false} />
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="pdp-stage"
                            onClick={() => setLightboxOpen(true)}
                            aria-label="Open image zoom"
                        >
                            {displayImages.map((img, i) => (
                                <img
                                    key={`${img.src}-${i}`}
                                    src={img.src}
                                    alt={img.alt}
                                    draggable={false}
                                    className={`pdp-stage-image${activeImage === i ? ' is-active' : ''}`}
                                />
                            ))}
                            {product.isNew && <span className="pdp-new-badge">New</span>}
                            <span className="pdp-zoom-hint" aria-hidden>
                                Click to zoom
                            </span>
                        </button>
                    </div>

                    <div className="pdp-info">
                        <p className="pdp-meta">
                            {product.brand && product.brandHandle ? (
                                <Link href={`/brands/${product.brandHandle}`} className="pdp-brand">
                                    {product.brand}
                                </Link>
                            ) : (
                                product.brand
                            )}
                            {product.brand && product.category && (
                                <span className="pdp-meta-sep"> · </span>
                            )}
                            {product.categorySlug ? (
                                <Link href={`/shop/${product.categorySlug}`} className="pdp-category">
                                    {product.category}
                                </Link>
                            ) : (
                                <span className="pdp-category">{product.category}</span>
                            )}
                        </p>
                        <h1 className="pdp-title">{product.name}</h1>
                        {priceOnRequest ? (
                            <span className="pdp-price-badge">
                                <Lock size={14} strokeWidth={1.75} aria-hidden />
                                Price on request
                            </span>
                        ) : (
                            <p className="pdp-price">{displayPrice}</p>
                        )}
                        {displaySku && (
                            <p className="pdp-sku">SKU: {displaySku}</p>
                        )}
                        {selectedVariant && (
                            <p className="pdp-stock">{selectedVariant.stockStatusLabel}</p>
                        )}
                        <p className="pdp-description">{product.description}</p>

                        {product.variants && product.variants.length > 0 && (
                            <ProductVariantPicker
                                variants={product.variants}
                                selectedId={selectedVariant?.id ?? null}
                                onSelect={setSelectedVariantId}
                                optionLabels={optionLabels}
                            />
                        )}

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
                            {added ? 'Added to bag' : 'Add to bag'}
                        </button>

                        <ProductTemplateSpecs
                            template={product.template}
                            specs={product.specs ?? []}
                        />
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

            {lightboxOpen && displayImages[activeImage] && (
                <ImageLightbox
                    src={displayImages[activeImage].src}
                    alt={displayImages[activeImage].alt}
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
                    max-width: 1500px;
                    margin: 0 auto;
                    padding: 20px 30px 48px;
                    box-sizing: border-box;
                    border-bottom: 1px solid #f0f0ec;
                }

                .pdp-breadcrumbs {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 28px;
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
                    transition: color 0.2s ease;
                }

                .pdp-crumb-link { color: #999; }
                .pdp-crumb-link:hover { color: #060606; }
                .pdp-crumb-current { color: #060606; }
                .pdp-crumb-sep { color: #ccc; }

                .pdp-layout {
                    display: grid;
                    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 440px);
                    gap: 48px;
                    align-items: start;
                }

                .pdp-gallery {
                    display: flex;
                    gap: 16px;
                    min-width: 0;
                }

                .pdp-thumbs {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 72px;
                    flex-shrink: 0;
                    max-height: min(72vh, 640px);
                    overflow-y: auto;
                    scrollbar-width: thin;
                }

                .pdp-thumb {
                    width: 72px;
                    height: 88px;
                    flex-shrink: 0;
                    border: 1px solid transparent;
                    padding: 0;
                    cursor: pointer;
                    overflow: hidden;
                    background: #fafaf8;
                    transition: border-color 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
                    opacity: 0.72;
                }

                .pdp-thumb:hover {
                    opacity: 1;
                    border-color: #d8d8d2;
                }

                .pdp-thumb--active {
                    opacity: 1;
                    border-color: #060606;
                    transform: translateX(2px);
                }

                .pdp-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    pointer-events: none;
                }

                .pdp-stage {
                    flex: 1;
                    min-width: 0;
                    position: relative;
                    aspect-ratio: 4 / 5;
                    max-height: min(78vh, 760px);
                    background: #fafaf8;
                    border: none;
                    padding: 0;
                    cursor: zoom-in;
                    overflow: hidden;
                }

                .pdp-stage-image {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                    opacity: 0;
                    transform: scale(1.03);
                    transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: opacity, transform;
                    pointer-events: none;
                }

                .pdp-stage-image.is-active {
                    opacity: 1;
                    transform: scale(1);
                    z-index: 1;
                }

                .pdp-stage:hover .pdp-stage-image.is-active {
                    transform: scale(1.015);
                }

                .pdp-new-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    z-index: 2;
                    background: #060606;
                    color: #fff;
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 500;
                    padding: 5px 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }

                .pdp-zoom-hint {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    z-index: 2;
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #060606;
                    background: rgba(255, 255, 255, 0.88);
                    backdrop-filter: blur(8px);
                    padding: 6px 10px;
                    opacity: 0;
                    transform: translateY(4px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .pdp-stage:hover .pdp-zoom-hint {
                    opacity: 1;
                    transform: translateY(0);
                }

                .pdp-info {
                    position: sticky;
                    top: 120px;
                    max-height: calc(100vh - 140px);
                    overflow-y: auto;
                    padding-right: 4px;
                    scrollbar-width: thin;
                }

                .pdp-meta {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #999;
                    margin: 0 0 8px;
                }

                .pdp-brand,
                .pdp-category {
                    color: inherit;
                    text-decoration: none;
                }

                .pdp-brand:hover,
                .pdp-category:hover {
                    color: #060606;
                }

                .pdp-meta-sep {
                    color: #ccc;
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
                    margin: 0 0 8px;
                }

                .pdp-price-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #060606;
                    border: 1px solid #e8e8e1;
                    background: #f7f7f5;
                    padding: 8px 12px;
                    margin: 0 0 12px;
                }

                .pdp-sku,
                .pdp-stock {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    color: #888;
                    margin: 0 0 12px;
                }

                .pdp-variant-picker {
                    margin-bottom: 24px;
                }

                .pdp-variant-option-group + .pdp-variant-option-group {
                    margin-top: 16px;
                }

                .pdp-variant-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }

                .pdp-variant-chip {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    padding: 8px 14px;
                    border: 1px solid #e0e0da;
                    background: #fff;
                    cursor: pointer;
                    transition: border-color 0.2s ease, background 0.2s ease;
                }

                .pdp-variant-chip:hover {
                    border-color: #060606;
                }

                .pdp-variant-chip--active {
                    border-color: #060606;
                    background: #060606;
                    color: #fff;
                }

                .pdp-template-specs {
                    margin-top: 28px;
                    padding-top: 24px;
                    border-top: 1px solid #f0f0ec;
                }

                .pdp-spec-grid {
                    display: grid;
                    gap: 12px 24px;
                    margin: 12px 0 0;
                }

                .pdp-spec-grid--two-column {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .pdp-spec-row dt {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #999;
                    margin-bottom: 4px;
                }

                .pdp-spec-row dd {
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                    color: #060606;
                    margin: 0;
                    line-height: 1.5;
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
                    transition: background 0.3s ease, transform 0.2s ease;
                }

                .pdp-add-btn:hover {
                    transform: translateY(-1px);
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
                        padding: 16px 20px 40px;
                    }

                    .pdp-layout {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }

                    .pdp-gallery {
                        flex-direction: column-reverse;
                        gap: 12px;
                    }

                    .pdp-thumbs {
                        flex-direction: row;
                        width: 100%;
                        max-height: none;
                        overflow-x: auto;
                        overflow-y: hidden;
                        padding-bottom: 4px;
                    }

                    .pdp-thumb--active {
                        transform: translateY(0);
                    }

                    .pdp-stage {
                        max-height: none;
                        width: 100%;
                    }

                    .pdp-info {
                        position: static;
                        max-height: none;
                        overflow: visible;
                    }

                    .pdp-zoom-hint {
                        opacity: 1;
                        transform: translateY(0);
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
