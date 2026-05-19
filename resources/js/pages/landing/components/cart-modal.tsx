/* eslint-disable @stylistic/padding-line-between-statements */
import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from '@inertiajs/react';
import { formatNaira } from '@/lib/cart';
import { checkout } from '@/routes';

export default function CartModal() {
    const {
        items,
        isOpen,
        closeCart,
        updateQuantity,
        subtotal,
        orderNote,
        setOrderNote,
    } = useCart();

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCheckout = () => {
        closeCart();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeCart}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.35)',
                    zIndex: 200,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '100%',
                    maxWidth: '480px',
                    background: '#ffffff',
                    zIndex: 201,
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '28px 32px 24px',
                        borderBottom: '1px solid #e8e8e1',
                        flexShrink: 0,
                    }}
                >
                    <h2
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '22px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: 0,
                            letterSpacing: '0.01em',
                        }}
                    >
                        Shopping Bag
                    </h2>
                    <button
                        onClick={closeCart}
                        aria-label="Close cart"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#060606',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                    {items.length === 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: '12px',
                                color: '#999',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                letterSpacing: '1px',
                            }}
                        >
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Your bag is empty
                            <Link
                                href="/shop"
                                onClick={closeCart}
                                style={{
                                    marginTop: '8px',
                                    fontSize: '11px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#060606',
                                }}
                            >
                                Continue shopping
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '20px',
                                    padding: '24px 32px',
                                    borderBottom: '1px solid #f0f0ec',
                                }}
                            >
                                {/* Product image */}
                                <div
                                    style={{
                                        width: '80px',
                                        height: '90px',
                                        flexShrink: 0,
                                        background: '#f5f5f3',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 300,
                                            letterSpacing: '1.5px',
                                            color: '#999',
                                            margin: '0 0 4px',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {item.category}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily:
                                                '"Proza Libre", sans-serif',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            color: '#060606',
                                            margin: '0 0 14px',
                                        }}
                                    >
                                        {item.name}
                                    </p>

                                    {/* Quantity controls */}
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            border: '1px solid #d0d0cc',
                                            height: '38px',
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            aria-label="Decrease quantity"
                                            style={{
                                                width: '38px',
                                                height: '38px',
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
                                                width: '36px',
                                                textAlign: 'center',
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '13px',
                                                fontWeight: 400,
                                                color: '#060606',
                                                borderLeft: '1px solid #d0d0cc',
                                                borderRight:
                                                    '1px solid #d0d0cc',
                                                lineHeight: '38px',
                                            }}
                                        >
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            aria-label="Increase quantity"
                                            style={{
                                                width: '38px',
                                                height: '38px',
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

                                {/* Price */}
                                <div
                                    style={{
                                        flexShrink: 0,
                                        textAlign: 'right',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            color: '#060606',
                                            margin: 0,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {formatNaira(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        style={{
                            flexShrink: 0,
                            padding: '24px 32px 32px',
                            borderTop: '1px solid #e8e8e1',
                        }}
                    >
                        {/* Subtotal */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    color: '#060606',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Subtotal
                            </span>
                            <span
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: '#060606',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {formatNaira(subtotal)}
                            </span>
                        </div>

                        <label
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: '#6b6b6b',
                                display: 'block',
                                marginBottom: '6px',
                            }}
                        >
                            Order note
                        </label>
                        <textarea
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder="Special instructions (preview only)"
                            rows={2}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '10px',
                                border: '1px solid #e8e8e1',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                            }}
                        />
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 300,
                                color: '#999',
                                letterSpacing: '0.5px',
                                margin: '0 0 20px',
                            }}
                        >
                            Shipping within Nigeria calculated at checkout. Taxes included where applicable.
                        </p>

                        {/* Proceed to Checkout */}
                        <Link href={checkout().url}>
                            <button className="mb-3 w-full cursor-pointer border-none bg-hemere-black p-4 font-poppins text-xs font-medium tracking-wide text-white uppercase hover:bg-hemere-foreground">
                                Proceed to Checkout
                            </button>
                        </Link>
                        {/* Continue Shopping */}
                        <button
                            onClick={closeCart}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                color: '#060606',
                                border: '1px solid #d0d0cc',
                                padding: '15px',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                fontWeight: 400,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition:
                                    'border-color 0.2s ease, background 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).style.background = '#f5f5f3';
                            }}
                            onMouseLeave={(e) => {
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).style.background = 'transparent';
                            }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
