import { Head } from '@inertiajs/react';
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

const bodyStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    color: '#6b6b6b',
    lineHeight: 1.8,
    margin: '0 0 20px',
};

export default function AboutPage() {
    return (
        <StorefrontShell>
            <Head title="About Us" />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 30px' }}>
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
                    Our Story
                </p>
                <h1 style={{ ...headingStyle, fontSize: '32px', marginBottom: '24px' }}>
                    From Vision to Distinction
                </h1>
                <p style={bodyStyle}>
                    {BRAND.name}&apos;s inception was driven by a powerful vision — to
                    infuse elegance, style, and comfort into Nigerian homes.
                    Established in {BRAND.founded} by interior designer and entrepreneur{' '}
                    {BRAND.founder}, {BRAND.legalName} was born from a deep passion for
                    home decor, aiming to transform mundane living spaces into
                    extraordinary sanctuaries.
                </p>
                <h2 style={headingStyle}>The Genesis</h2>
                <p style={bodyStyle}>
                    {BRAND.founder}&apos;s journey began with her own home. Dissatisfied
                    with lacklustre offerings in Nigeria, she travelled through Europe
                    discovering unique, high-quality decor pieces. Upon her return, she
                    launched {BRAND.name} — a boutique home decor store in Victoria
                    Island, Lagos. The store quickly gained a reputation for its exclusive
                    collection of home accessories, fragrances, furniture, and lighting.
                </p>
                <h2 style={headingStyle}>Growth and Expansion</h2>
                <p style={bodyStyle}>
                    As word spread about the unmatched quality and elegance of our
                    products, demand surged. Today, {BRAND.name} stands as a beacon of
                    luxury home decor, celebrated for distinctive and sophisticated
                    offerings across Nigeria.
                </p>
                <h2 style={headingStyle}>Our Vision</h2>
                <p style={bodyStyle}>
                    To be the foremost supplier of interior lighting, furniture, and
                    accessories in Nigeria — beautifying spaces and setting the standard
                    for excellence, sophistication, and customer satisfaction.
                </p>
                <h2 style={headingStyle}>Our Mission</h2>
                <p style={{ ...bodyStyle, marginBottom: 0 }}>
                    To transform every house into a warm and inviting home through our
                    meticulously curated selection of top-tier products — combining beauty
                    and practicality so each piece enhances both aesthetics and
                    functionality of your living space.
                </p>
            </div>
        </StorefrontShell>
    );
}
