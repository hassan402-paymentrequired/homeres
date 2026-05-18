import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import SiteHeader from '../landing';
import CartModal from '../landing/components/cart-modal';
import type { QuickViewProduct } from '../landing/components/product-quick-view';
import ProductQuickView from '../landing/components/product-quick-view';
import SiteFooter from '../landing/components/site-footer';

const productData: Record<
    string,
    {
        id: string;
        name: string;
        brand: string;
        price: string;
        category: string;
        description: string;
        details: string[];
        images: { src: string; alt: string }[];
        isNew?: boolean;
        dimensions?: string;
        material?: string;
        sku?: string;
    }
> = {
    'P-001': {
        id: 'P-001',
        name: 'Arc Floor Lamp',
        brand: 'HEMERE',
        price: '₦480',
        category: 'Lighting',
        description:
            'A sculptural arc floor lamp with a hand-finished brass arm and a weighted marble base. Designed to cast a warm, directional glow over reading chairs and sofas. The adjustable arm allows you to position the light exactly where you need it.',
        details: [
            'Hand-finished brass arm',
            'Carrara marble base',
            'E27 bulb socket (bulb not included)',
            'Max 60W or equivalent LED',
            'Cable length: 2.5m with inline dimmer',
        ],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f5953049-1767872582568.png',
                alt: 'Arc floor lamp with curved brass arm and marble base, front view',
            },
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_16ff2b36d-1772149684970.png',
                alt: 'Arc floor lamp detail showing brass arm finish and joint',
            },
            {
                src: 'https://images.unsplash.com/photo-1508952270829-73af1ff30f5d',
                alt: 'Arc floor lamp in a living room setting next to a linen sofa',
            },
        ],

        isNew: true,
        dimensions: 'W 60 × D 60 × H 180 cm',
        material: 'Brass, Carrara Marble',
        sku: 'HM-ARC-001',
    },
    'P-002': {
        id: 'P-002',
        name: 'Linen Throw Cushion',
        brand: 'HEMERE',
        price: '₦95',
        category: 'Textiles',
        description:
            'A generously filled cushion in a tightly woven ivory boucle. The textured surface adds warmth and depth to any sofa or armchair. Removable cover with a concealed zip closure.',
        details: [
            '100% boucle wool cover',
            'Feather and down inner',
            'Removable cover — dry clean only',
            'Concealed zip closure',
            'Available in ivory and stone',
        ],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1065d7918-1771884763956.png',
                alt: 'Ivory boucle cushion with textured weave on a linen sofa',
            },
            {
                src: 'https://images.unsplash.com/photo-1665932993811-bf8d66944436',
                alt: 'Close-up of boucle cushion texture showing tight weave detail',
            },
        ],

        dimensions: '50 × 50 cm',
        material: 'Boucle Wool',
        sku: 'HM-CUS-002',
    },
};

const relatedProducts: QuickViewProduct[] = [
    {
        id: 'P-002',
        name: 'Linen Throw Cushion',
        brand: 'HEMERE',
        price: '₦95',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1065d7918-1771884763956.png',
        alt: 'Ivory boucle cushion with textured weave',
        category: 'Textiles',
    },
    {
        id: 'P-004',
        name: 'Amber Glass Vase',
        brand: 'HEMERE',
        price: '₦145',
        image: 'https://images.unsplash.com/photo-1612943727861-72cc8b272114',
        alt: 'Amber smoked glass statement vase',
        category: 'Home Accessories',
    },
    {
        id: 'P-005',
        name: 'Soy Wax Candle Set',
        brand: 'HEMERE',
        price: '₦68',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
        alt: 'Luxury soy wax candle set in glass vessels',
        category: 'Candles & Fragrance',
    },
    {
        id: 'P-008',
        name: 'The Art of Interiors',
        brand: 'HEMERE',
        price: '₦58',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cb32b081-1772217915322.png',
        alt: 'Coffee table book on interior design',
        category: 'Coffee Table Books',
    },
];

export default function ProductDetailsPage() {
    const product = productData['P-002'] || productData['P-001'];
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [quickViewProduct, setQuickViewProduct] =
        useState<QuickViewProduct | null>(null);
    const [hoveredRelated, setHoveredRelated] = useState<
        string | number | null
    >(null);

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <>
            <SiteHeader />
            <CartModal />

            <main
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#060606',
                    background: '#ffffff',
                    minHeight: '100vh',
                }}
            >
                {/* Breadcrumb */}
                <div
                    style={{
                        maxWidth: '1500px',
                        margin: '0 auto',
                        padding: '16px 30px',
                        borderBottom: '1px solid #f0f0ec',
                    }}
                >
                    <nav
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        {[
                            { label: 'Home', href: '/' },
                            { label: product.category, href: '#' },
                            { label: product.name, href: '#' },
                        ].map((crumb, i, arr) => (
                            <React.Fragment key={crumb.label}>
                                {i < arr.length - 1 ? (
                                    <>
                                        <Link
                                            href={crumb.href}
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '11px',
                                                fontWeight: 300,
                                                color: '#999',
                                                textDecoration: 'none',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {crumb.label}
                                        </Link>
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#ccc"
                                            strokeWidth="2"
                                        >
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </>
                                ) : (
                                    <span
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 400,
                                            color: '#060606',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {crumb.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                {/* Product section */}
                <div
                    style={{
                        maxWidth: '1500px',
                        margin: '0 auto',
                        padding: '48px 30px',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 480px',
                            gap: '64px',
                            alignItems: 'start',
                        }}
                    >
                        {/* Images */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {/* Thumbnails */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    width: '72px',
                                    flexShrink: 0,
                                }}
                            >
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        style={{
                                            width: '72px',
                                            height: '88px',
                                            background: '#f5f5f3',
                                            border:
                                                activeImage === i
                                                    ? '2px solid #060606'
                                                    : '2px solid transparent',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                            {/* Main image */}
                            <div
                                style={{
                                    flex: 1,
                                    aspectRatio: '3/4',
                                    background: '#f5f5f3',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                            >
                                <img
                                    src={product.images[activeImage]?.src}
                                    alt={product.images[activeImage]?.alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {product.isNew && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '16px',
                                            left: '16px',
                                            background: '#060606',
                                            color: '#ffffff',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            padding: '4px 10px',
                                        }}
                                    >
                                        New
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ position: 'sticky', top: '80px' }}>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 400,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#999',
                                    margin: '0 0 10px',
                                }}
                            >
                                {product.category}
                            </p>
                            <h1
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '32px',
                                    fontWeight: 500,
                                    color: '#060606',
                                    margin: '0 0 12px',
                                    letterSpacing: '0.02em',
                                    lineHeight: 1.2,
                                }}
                            >
                                {product.name}
                            </h1>
                            <p
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '26px',
                                    fontWeight: 400,
                                    color: '#060606',
                                    margin: '0 0 24px',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {product.price}
                            </p>

                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '13px',
                                    fontWeight: 300,
                                    color: '#6b6b6b',
                                    margin: '0 0 28px',
                                    lineHeight: '1.8',
                                    letterSpacing: '0.3px',
                                }}
                            >
                                {product.description}
                            </p>

                            {/* Quantity */}
                            <div style={{ marginBottom: '20px' }}>
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '10px',
                                        fontWeight: 400,
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        color: '#6b6b6b',
                                        margin: '0 0 10px',
                                    }}
                                >
                                    Quantity
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #e8e8e1',
                                        width: 'fit-content',
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.max(1, q - 1),
                                            )
                                        }
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#060606',
                                            fontSize: '20px',
                                            fontWeight: 300,
                                        }}
                                    >
                                        −
                                    </button>
                                    <span
                                        style={{
                                            width: '52px',
                                            textAlign: 'center',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            color: '#060606',
                                        }}
                                    >
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity((q) => q + 1)
                                        }
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#060606',
                                            fontSize: '20px',
                                            fontWeight: 300,
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to cart */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    marginBottom: '32px',
                                }}
                            >
                                <button
                                    onClick={handleAddToCart}
                                    style={{
                                        background: added
                                            ? '#1a7a3c'
                                            : '#060606',
                                        color: '#ffffff',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        padding: '16px 24px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'background 0.2s ease',
                                    }}
                                >
                                    {added ? (
                                        <>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Added to Bag
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                                <line
                                                    x1="3"
                                                    y1="6"
                                                    x2="21"
                                                    y2="6"
                                                />
                                                <path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                            Add to Bag
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Product details */}
                            <div
                                style={{
                                    borderTop: '1px solid #f0f0ec',
                                    paddingTop: '24px',
                                    marginBottom: '24px',
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '10px',
                                        fontWeight: 400,
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#6b6b6b',
                                        margin: '0 0 14px',
                                    }}
                                >
                                    Product Details
                                </p>
                                <ul
                                    style={{
                                        margin: 0,
                                        padding: '0 0 0 16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    {product.details.map((d, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '12px',
                                                fontWeight: 300,
                                                color: '#6b6b6b',
                                                letterSpacing: '0.3px',
                                                lineHeight: '1.6',
                                            }}
                                        >
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Specs */}
                            <div
                                style={{
                                    borderTop: '1px solid #f0f0ec',
                                    paddingTop: '24px',
                                    marginBottom: '24px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0',
                                    }}
                                >
                                    {[
                                        {
                                            label: 'Material',
                                            value: product.material,
                                        },
                                        {
                                            label: 'Dimensions',
                                            value: product.dimensions,
                                        },
                                        { label: 'SKU', value: product.sku },
                                    ]
                                        .filter((r) => r.value)
                                        .map((row) => (
                                            <div
                                                key={row.label}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    padding: '10px 0',
                                                    borderBottom:
                                                        '1px solid #f0f0ec',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            'Poppins, sans-serif',
                                                        fontSize: '11px',
                                                        fontWeight: 300,
                                                        color: '#999',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    {row.label}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            'Poppins, sans-serif',
                                                        fontSize: '11px',
                                                        fontWeight: 400,
                                                        color: '#060606',
                                                        letterSpacing: '0.3px',
                                                    }}
                                                >
                                                    {row.value}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Shipping */}
                            <div
                                style={{
                                    borderTop: '1px solid #f0f0ec',
                                    paddingTop: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    {[
                                        {
                                            icon: (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <rect
                                                        x="1"
                                                        y="3"
                                                        width="15"
                                                        height="13"
                                                    />
                                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                                    <circle
                                                        cx="5.5"
                                                        cy="18.5"
                                                        r="2.5"
                                                    />
                                                    <circle
                                                        cx="18.5"
                                                        cy="18.5"
                                                        r="2.5"
                                                    />
                                                </svg>
                                            ),
                                            text: 'Free shipping on orders over ₦200',
                                        },
                                        {
                                            icon: (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <polyline points="23 4 23 10 17 10" />
                                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                                </svg>
                                            ),
                                            text: '30-day free returns',
                                        },
                                        {
                                            icon: (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                </svg>
                                            ),
                                            text: '2-year quality guarantee',
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: '#999',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily:
                                                        'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    fontWeight: 300,
                                                    color: '#6b6b6b',
                                                    letterSpacing: '0.3px',
                                                }}
                                            >
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                <div
                    style={{
                        borderTop: '1px solid #f0f0ec',
                        padding: '64px 30px',
                    }}
                >
                    <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between',
                                marginBottom: '32px',
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '22px',
                                    fontWeight: 500,
                                    color: '#060606',
                                    margin: 0,
                                    letterSpacing: '0.02em',
                                }}
                            >
                                You May Also Like
                            </h2>
                            <Link
                                href="/"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 300,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#060606',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid #060606',
                                    paddingBottom: '1px',
                                }}
                            >
                                View all
                            </Link>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '24px',
                            }}
                        >
                            {relatedProducts.map((rp) => (
                                <div key={rp.id} style={{ cursor: 'pointer' }}>
                                    <div
                                        style={{
                                            aspectRatio: '3/4',
                                            background: '#f5f5f3',
                                            overflow: 'hidden',
                                            marginBottom: '12px',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredRelated(rp.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredRelated(null)
                                        }
                                    >
                                        <img
                                            src={rp.image}
                                            alt={rp.alt}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition:
                                                    'transform 0.6s ease',
                                                transform:
                                                    hoveredRelated === rp.id
                                                        ? 'scale(1.05)'
                                                        : 'scale(1)',
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: '12px',
                                                opacity:
                                                    hoveredRelated === rp.id
                                                        ? 1
                                                        : 0,
                                                transform:
                                                    hoveredRelated === rp.id
                                                        ? 'translateY(0)'
                                                        : 'translateY(8px)',
                                                transition: 'all 0.25s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    setQuickViewProduct(rp)
                                                }
                                                style={{
                                                    background:
                                                        'rgba(255,255,255,0.92)',
                                                    color: '#060606',
                                                    fontFamily:
                                                        'Poppins, sans-serif',
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
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 400,
                                            color: '#060606',
                                            margin: '0 0 4px',
                                            letterSpacing: '0.3px',
                                        }}
                                    >
                                        {rp.name}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 300,
                                            color: '#6b6b6b',
                                            margin: 0,
                                            letterSpacing: '0.3px',
                                        }}
                                    >
                                        {rp.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />

            <ProductQuickView
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </>
    );
}
