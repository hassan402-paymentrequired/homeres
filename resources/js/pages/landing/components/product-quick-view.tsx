/* eslint-disable curly */
import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export interface QuickViewProduct {
    id: number | string;
    name: string;
    brand: string;
    price: string;
    image: string;
    alt: string;
    href?: string;
    isNew?: boolean;
    category?: string;
    description?: string;
}

interface ProductQuickViewProps {
    product: QuickViewProduct | null;
    onClose: () => void;
}

export default function ProductQuickView({
    product,
    onClose,
}: ProductQuickViewProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setAdded(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [product]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);

        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!product) return null;

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(6,6,6,0.5)',
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'relative',
                    background: '#ffffff',
                    width: '100%',
                    maxWidth: '860px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    overflow: 'hidden',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 10,
                        background: '#ffffff',
                        border: '1px solid #e8e8e1',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#060606',
                    }}
                    aria-label="Close quick view"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Image */}
                <div
                    style={{
                        aspectRatio: '3/4',
                        background: '#f5f5f3',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.alt}
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

                {/* Details */}
                <div
                    style={{
                        padding: '40px 36px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '0',
                    }}
                >
                    {product.category && (
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
                    )}
                    <h2
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '22px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: '0 0 8px',
                            letterSpacing: '0.02em',
                            lineHeight: 1.3,
                        }}
                    >
                        {product.name}
                    </h2>
                    <p
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#060606',
                            margin: '0 0 20px',
                            letterSpacing: '0.02em',
                        }}
                    >
                        {product.price}
                    </p>

                    {product.description && (
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                margin: '0 0 24px',
                                lineHeight: '1.7',
                                letterSpacing: '0.3px',
                            }}
                        >
                            {product.description}
                        </p>
                    )}

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
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#060606',
                                    fontSize: '18px',
                                    fontWeight: 300,
                                }}
                            >
                                −
                            </button>
                            <span
                                style={{
                                    width: '48px',
                                    textAlign: 'center',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '13px',
                                    fontWeight: 400,
                                    color: '#060606',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#060606',
                                    fontSize: '18px',
                                    fontWeight: 300,
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <button
                            onClick={handleAddToCart}
                            style={{
                                background: added ? '#1a7a3c' : '#060606',
                                color: '#ffffff',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                padding: '14px 24px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
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
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                    Add to Bag
                                </>
                            )}
                        </button>
                        <Link
                            href={`/products/${product.id}`}
                            onClick={onClose}
                            style={{
                                background: '#ffffff',
                                color: '#060606',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 400,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                padding: '13px 24px',
                                border: '1px solid #e8e8e1',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                transition: 'border-color 0.15s ease',
                            }}
                        >
                            View Full Details
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Meta */}
                    <div
                        style={{
                            marginTop: '24px',
                            paddingTop: '20px',
                            borderTop: '1px solid #f0f0ec',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '20px' }}>
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
                                    label: 'Free shipping over ₦200',
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
                                    label: '30-day returns',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <span style={{ color: '#999' }}>
                                        {item.icon}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px',
                                            fontWeight: 300,
                                            color: '#999',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
