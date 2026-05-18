import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BRAND } from '@/data/brand';
import StorefrontShell from '@/components/storefront/storefront-shell';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <StorefrontShell>
            <Head title="Contact Us" />
            <div
                style={{
                    maxWidth: '1500px',
                    margin: '0 auto',
                    padding: '64px 30px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '64px',
                }}
                className="contact-grid"
            >
                <div>
                    <h1
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '32px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: '0 0 16px',
                        }}
                    >
                        Contact Us
                    </h1>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: 300,
                            color: '#6b6b6b',
                            lineHeight: 1.8,
                            margin: '0 0 32px',
                        }}
                    >
                        We&apos;d love to hear from you. Whether you have a question
                        about our products or need assistance with your order, our
                        friendly team is here to help.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '20px' }}>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#999',
                                    margin: '0 0 4px',
                                }}
                            >
                                Email
                            </p>
                            <a
                                href={`mailto:${BRAND.email}`}
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    color: '#060606',
                                }}
                            >
                                {BRAND.email}
                            </a>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#999',
                                    margin: '0 0 4px',
                                }}
                            >
                                Phone
                            </p>
                            <a
                                href={BRAND.phoneHref}
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    color: '#060606',
                                }}
                            >
                                {BRAND.phone}
                            </a>
                        </li>
                        <li>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#999',
                                    margin: '0 0 4px',
                                }}
                            >
                                Flagship Store
                            </p>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    color: '#060606',
                                    lineHeight: 1.7,
                                    margin: 0,
                                }}
                            >
                                {BRAND.address}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    {submitted ? (
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                color: '#060606',
                                padding: '24px',
                                background: '#f5f5f3',
                            }}
                        >
                            Thank you for your message. This is a preview form — no
                            message has been sent. We will enable live contact when the
                            store launches.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {[
                                { name: 'name', label: 'Name', type: 'text' },
                                { name: 'email', label: 'Email', type: 'email' },
                                { name: 'phone', label: 'Phone', type: 'tel' },
                            ].map((field) => (
                                <div key={field.name} style={{ marginBottom: '16px' }}>
                                    <label
                                        htmlFor={field.name}
                                        style={{
                                            display: 'block',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 400,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        required={field.name !== 'phone'}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '1px solid #e8e8e1',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            ))}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    htmlFor="message"
                                    style={{
                                        display: 'block',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '11px',
                                        fontWeight: 400,
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e8e8e1',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '13px',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    background: '#060606',
                                    color: '#fff',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    padding: '14px 32px',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Send message
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
