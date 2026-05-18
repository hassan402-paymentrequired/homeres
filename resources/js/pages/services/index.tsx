import { Head, Link } from '@inertiajs/react';
import { BRAND } from '@/data/brand';
import StorefrontShell from '@/components/storefront/storefront-shell';

const headingStyle: React.CSSProperties = {
    fontFamily: '"Proza Libre", sans-serif',
    fontSize: 'calc(29px * 0.63)',
    fontWeight: 500,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: '#060606',
    margin: '0 0 16px',
};

export default function ServicesPage() {
    return (
        <StorefrontShell>
            <Head title="Design Studio & Services" />
            <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '64px 30px' }}>
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        fontWeight: 400,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#999',
                        margin: '0 0 12px',
                    }}
                >
                    Design Studio
                </p>
                <h1 style={{ ...headingStyle, fontSize: '32px', marginBottom: '16px' }}>
                    Beyond the Store
                </h1>
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontWeight: 300,
                        color: '#6b6b6b',
                        lineHeight: 1.8,
                        maxWidth: '640px',
                        margin: '0 0 48px',
                    }}
                >
                    While {BRAND.name} is renowned for its in-store products, we also
                    provide comprehensive services to cater to all your home decor needs.
                </p>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '32px',
                    }}
                    className="services-grid"
                >
                    <article
                        style={{
                            padding: '40px',
                            background: '#f5f5f3',
                            border: '1px solid #e8e8e1',
                        }}
                    >
                        <h2 style={headingStyle}>Interior Design</h2>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                lineHeight: 1.8,
                                margin: '0 0 20px',
                            }}
                        >
                            Bespoke interior design for commercial and residential spaces.
                            We work closely with clients to create stunning, functional
                            environments that reflect their unique tastes and preferences.
                        </p>
                        <Link
                            href="/contact"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#060606',
                                textDecoration: 'none',
                                borderBottom: '1px solid #060606',
                            }}
                        >
                            Enquire now
                        </Link>
                    </article>
                    <article
                        style={{
                            padding: '40px',
                            background: '#f5f5f3',
                            border: '1px solid #e8e8e1',
                        }}
                    >
                        <h2 style={headingStyle}>Home Styling</h2>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                lineHeight: 1.8,
                                margin: '0 0 20px',
                            }}
                        >
                            Whether you are preparing for a special event or refreshing
                            your living space, our stylists work with you to create a
                            cohesive and beautiful aesthetic throughout your home.
                        </p>
                        <Link
                            href="/contact"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#060606',
                                textDecoration: 'none',
                                borderBottom: '1px solid #060606',
                            }}
                        >
                            Book a consultation
                        </Link>
                    </article>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .services-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
