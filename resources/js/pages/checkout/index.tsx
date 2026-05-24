/* eslint-disable import/order */
'use client';
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useCart } from '@/context/CartContext';
import { home } from '@/routes';

type Props = {
    paystackConfigured: boolean;
};

export default function CheckoutPage({ paystackConfigured }: Props) {
    const { items, subtotal, orderNote, hasPriceOnRequest } = useCart();
    const shipping = 0;
    const total = subtotal + shipping;
    const [processing, setProcessing] = useState(false);

    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        phone: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            return;
        }

        setProcessing(true);

        router.post(
            '/checkout',
            {
                customer_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
                customer_email: form.email.trim(),
                customer_phone: form.phone.trim() || null,
                shipping_address: form.address.trim(),
                shipping_city: form.city.trim(),
                shipping_state: form.state.trim() || null,
                customer_note: orderNote.trim() || null,
                items: items.map((item) => ({
                    variant_id: item.variantId,
                    quantity: item.quantity,
                })),
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontWeight: 300,
        letterSpacing: '0.5px',
        color: '#060606',
        background: '#ffffff',
        border: '1px solid #d0d0cc',
        padding: '12px 14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: '#060606',
        display: 'block',
        marginBottom: '6px',
    };

    return (
        <div
            style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#060606',
                background: '#ffffff',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <header
                style={{
                    borderBottom: '1px solid #e8e8e1',
                    padding: '0 40px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    background: '#ffffff',
                    zIndex: 10,
                }}
            >
                  <Link
                                href={home().url}
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '64px',
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Homère logo"
                                    style={{
                                        width: '88px',
                                        height: '44px',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Link>
                <Link
                    href="/"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        fontWeight: 300,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: '#666',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to shop
                </Link>
            </header>

            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '60px 40px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 420px',
                    gap: '80px',
                    alignItems: 'start',
                }}
            >
                {/* Left: Checkout Form */}
                <form onSubmit={handleSubmit}>
                    {/* Contact */}
                    <section style={{ marginBottom: '48px' }}>
                        <h2
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#060606',
                                margin: '0 0 24px',
                                letterSpacing: '0.02em',
                            }}
                        >
                            Contact Information
                        </h2>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+31 6 00 000 000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Shipping */}
                    <section style={{ marginBottom: '48px' }}>
                        <h2
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#060606',
                                margin: '0 0 24px',
                                letterSpacing: '0.02em',
                            }}
                        >
                            Shipping Address
                        </h2>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px',
                                }}
                            >
                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Address</label>
                                <input
                                    name="address"
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Street address"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px',
                                }}
                            >
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input
                                        name="city"
                                        type="text"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>State</label>
                                    <input
                                        name="state"
                                        type="text"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section style={{ marginBottom: '48px' }}>
                        <h2
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#060606',
                                margin: '0 0 24px',
                                letterSpacing: '0.02em',
                            }}
                        >
                            Payment
                        </h2>
                        <div
                            style={{
                                border: '1px solid #e8e8e1',
                                padding: '24px',
                                background: '#fafafa',
                                marginBottom: '16px',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 300,
                                    color: '#999',
                                    letterSpacing: '0.5px',
                                    margin: '0 0 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
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
                                        y="4"
                                        width="22"
                                        height="16"
                                        rx="2"
                                        ry="2"
                                    />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                All transactions are secure and encrypted
                            </p>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '13px',
                                    color: '#060606',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {hasPriceOnRequest
                                    ? 'Items marked price on request will be confirmed by our team before payment.'
                                    : paystackConfigured
                                      ? 'You will complete payment securely on Paystack after placing your order.'
                                      : 'Online payment will be enabled soon. Your order will be saved and our team will follow up.'}
                            </p>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={processing || items.length === 0}
                        style={{
                            width: '100%',
                            background: '#060606',
                            color: '#ffffff',
                            border: 'none',
                            padding: '18px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            cursor:
                                processing || items.length === 0
                                    ? 'not-allowed'
                                    : 'pointer',
                            opacity: processing || items.length === 0 ? 0.6 : 1,
                            transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                            ((
                                e.currentTarget as HTMLButtonElement
                            ).style.background = '#333')
                        }
                        onMouseLeave={(e) =>
                            ((
                                e.currentTarget as HTMLButtonElement
                            ).style.background = '#060606')
                        }
                    >
                        {processing
                            ? 'Processing…'
                            : hasPriceOnRequest && total === 0
                              ? 'Submit order'
                              : `Place order — ₦${total.toLocaleString('en-NG')}`}
                    </button>
                </form>

                {/* Right: Order Summary */}
                <div style={{ position: 'sticky', top: '84px' }}>
                    <h2
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '20px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: '0 0 24px',
                            letterSpacing: '0.02em',
                        }}
                    >
                        Order Summary
                    </h2>

                    <div style={{ border: '1px solid #e8e8e1', padding: '0' }}>
                        {items.length === 0 ? (
                            <div
                                style={{
                                    padding: '32px',
                                    textAlign: 'center',
                                    color: '#999',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 300,
                                }}
                            >
                                Your bag is empty
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.variantId}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '20px 24px',
                                        borderBottom: '1px solid #f0f0ec',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '60px',
                                                height: '68px',
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
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: '#060606',
                                                color: '#fff',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '10px',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '10px',
                                                fontWeight: 300,
                                                letterSpacing: '1.5px',
                                                color: '#999',
                                                margin: '0 0 3px',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {item.category}
                                        </p>
                                        <p
                                            style={{
                                                fontFamily:
                                                    '"Proza Libre", sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#060606',
                                                margin: 0,
                                            }}
                                        >
                                            {item.name}
                                        </p>
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '13px',
                                            fontWeight: 400,
                                            color: '#060606',
                                            margin: 0,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.priceOnRequest || item.price === null
                                            ? 'Price on request'
                                            : `₦${(item.price * item.quantity).toLocaleString('en-NG')}`}
                                    </p>
                                </div>
                            ))
                        )}

                        {/* Totals */}
                        <div
                            style={{
                                padding: '20px 24px',
                                borderTop: '1px solid #e8e8e1',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: '#666',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Subtotal
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: 400,
                                        color: '#060606',
                                    }}
                                >
                                    ₦
                                    {subtotal.toLocaleString('en-EU', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: '#666',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    Shipping
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: '#999',
                                    }}
                                >
                                    Calculated at checkout
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e8e8e1',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        color: '#060606',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Total
                                </span>
                                <span
                                    style={{
                                        fontFamily: '"Proza Libre", sans-serif',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#060606',
                                    }}
                                >
                                    ₦
                                    {total.toLocaleString('en-EU', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div
                        style={{
                            marginTop: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {[
                            { icon: '🔒', text: 'Secure SSL encryption' },
                            { icon: '↩', text: 'Free returns within 30 days' },
                            {
                                icon: '📦',
                                text: 'Free shipping on orders over ₦500',
                            },
                        ].map((badge) => (
                            <div
                                key={badge.text}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>
                                    {badge.icon}
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '11px',
                                        fontWeight: 300,
                                        color: '#666',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {badge.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
        </div>
    );
}
