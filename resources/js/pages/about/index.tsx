import { Head } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import StoreLocations from '@/pages/landing/components/store-location';

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

const listStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    color: '#6b6b6b',
    lineHeight: 1.8,
    margin: '0 0 20px',
    paddingLeft: '20px',
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
                    Get to Know Us
                </p>
                <h1 style={{ ...headingStyle, fontSize: '32px', marginBottom: '24px' }}>
                    Welcome to Homère Nigeria Limited
                </h1>
                <p style={bodyStyle}>
                    HOMÈRE is your premier destination for luxurious home decor, accessories,
                    fragrances, furniture, and lighting. We are dedicated to transforming every
                    house into a warm and inviting home through our carefully curated range of
                    top-tier products. With a strong commitment to both beauty and practicality,
                    we offer an extensive selection, ensuring each customer finds something that
                    truly mirrors their individual style.
                </p>

                <h2 style={headingStyle}>Our Story: From Vision to Distinction</h2>
                <p style={bodyStyle}>
                    HOMÈRE&apos;s inception was driven by a powerful vision — to infuse elegance,
                    style, and comfort into Nigerian homes. Established in 2021 by the talented
                    interior designer and entrepreneur, Gina Walschots, HOMÈRE was born from a deep
                    passion for home decor, aiming to transform mundane living spaces into
                    extraordinary sanctuaries.
                </p>

                <h2 style={headingStyle}>The Genesis</h2>
                <p style={bodyStyle}>
                    Gina Walschots&apos;s journey into home decor began with her own home.
                    Dissatisfied with the lackluster offerings in Nigeria, she embarked on a quest
                    to redefine home aesthetics. With a keen eye for design, she traveled through
                    Europe, discovering unique and high-quality decor pieces. Upon her return, she
                    launched HOMÈRE, a boutique home decor store in Victoria Island, Lagos. The
                    store quickly gained a reputation for its exclusive and exquisite collection of
                    home accessories, fragrances, furniture, and lighting.
                </p>

                <h2 style={headingStyle}>Growth and Expansion</h2>
                <p style={bodyStyle}>
                    As word spread about the unmatched quality and elegance of HOMÈRE&apos;s
                    products, demand surged. Today, HOMÈRE stands as a beacon of luxury home
                    decor, celebrated for its distinctive and sophisticated offerings.
                </p>

                <h2 style={headingStyle}>Our Vision</h2>
                <p style={bodyStyle}>
                    Our vision is to be the foremost supplier of interior lighting, furniture, and
                    accessories in Nigeria, beautifying spaces and setting the standard for
                    excellence, sophistication, and customer satisfaction.
                </p>

                <h2 style={headingStyle}>Our Mission</h2>
                <p style={bodyStyle}>
                    Our mission is to transform every house into a warm and inviting home through
                    our meticulously curated selection of top-tier products. We are deeply
                    committed to combining beauty and practicality, ensuring that each piece we
                    offer enhances both the aesthetics and functionality of your living space.
                </p>

                <h2 style={headingStyle}>Why Choose Homère Nigeria Limited?</h2>
                <ul style={listStyle}>
                    <li>
                        <strong>Quality Assurance:</strong> We source our products from reputable
                        manufacturers who adhere to the highest standards of quality and durability.
                    </li>
                    <li>
                        <strong>Diverse Selection:</strong> Our extensive range of home decor items
                        ensures that there is something for every style and preference.
                    </li>
                    <li>
                        <strong>Exceptional Customer Service:</strong> Our dedicated team is always
                        ready to assist you with personalized recommendations and support.
                    </li>
                    <li>
                        <strong>Affordable Luxury:</strong> We believe that elegance and quality
                        should be accessible to everyone. Our products offer exceptional value for
                        money.
                    </li>
                    <li>
                        <strong>Convenient Shopping:</strong> With our user-friendly website and
                        secure payment options, shopping for home decor has never been easier.
                    </li>
                </ul>

                <h2 style={headingStyle}>Our Unique Selling Proposition</h2>
                <p style={bodyStyle}>
                    At Homère Nigeria Limited, we blend timeless elegance with contemporary trends
                    to offer a unique shopping experience. Our curated collections are designed to
                    inspire and delight, making it easy for you to find the perfect pieces to
                    elevate your home&apos;s ambiance. From luxurious furniture to enchanting home
                    fragrances, each item is selected with an eye for detail and a commitment to
                    excellence. Discover the Homère difference today and let us help you create a
                    space that truly feels like home.
                </p>

                <h2 style={headingStyle}>Our Services</h2>
                <p style={bodyStyle}>
                    While HOMÈRE is renowned for its in-store products, we also provide
                    comprehensive services to cater to all your home decor needs:
                </p>
                <ul style={listStyle}>
                    <li>
                        <strong>Interior Design for Commercial and Residential Spaces:</strong> Our
                        expert team offers bespoke interior design services for both commercial and
                        residential spaces. We work closely with clients to create stunning,
                        functional environments that reflect their unique tastes and preferences.
                    </li>
                    <li>
                        <strong>Home Styling Services:</strong> Our home styling services are
                        designed to help you achieve the perfect look for your home. Whether
                        you&apos;re preparing for a special event or simply want to refresh your
                        living space, our stylists will work with you to create a cohesive and
                        beautiful aesthetic.
                    </li>
                </ul>

                <h2 style={headingStyle}>Our Products</h2>
                <ul style={listStyle}>
                    <li>
                        <strong>Home Decor Items:</strong> Wall Art, Vases, Clocks, Mirrors, Rugs
                    </li>
                    <li>
                        <strong>Home Accessories:</strong> Cushions and Throws, Decorative Bowls and
                        Trays, Picture Frames, Candles
                    </li>
                    <li>
                        <strong>Home Fragrances:</strong> Scented Candles, Diffusers, Room Sprays,
                        Essential Oils
                    </li>
                    <li>
                        <strong>Furniture:</strong> Sofas and Armchairs, Coffee Tables, Dining Sets,
                        Beds and Mattresses, Storage Solutions
                    </li>
                    <li>
                        <strong>Lighting:</strong> Ceiling Lights, Floor Lamps, Table Lamps, Wall
                        Lights, Chandeliers
                    </li>
                </ul>

                <h2 style={headingStyle}>Customer Testimonials</h2>
                <p style={bodyStyle}>
                    &ldquo;I transformed my living room with the beautiful pieces I found at Homère
                    Nigeria Limited. The quality is superb and the service was excellent.&rdquo; —
                    Ademola, Lagos
                </p>
                <p style={bodyStyle}>
                    &ldquo;Homère has become my go-to for all my home decor needs. The variety and
                    uniqueness of their products always impress me.&rdquo; — Chinwe, Abuja
                </p>

                <h2 style={headingStyle}>Contact Us</h2>
                <p style={bodyStyle}>
                    We&apos;d love to hear from you! Whether you have a question about our products
                    or need assistance with your order, our friendly customer service team is here
                    to help.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                    <li style={{ marginBottom: '12px' }}>
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
                            href="mailto:homerenigerialimited@gmail.com"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                fontWeight: 300,
                                color: '#060606',
                            }}
                        >
                            homerenigerialimited@gmail.com
                        </a>
                    </li>
                    <li style={{ marginBottom: '12px' }}>
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
                            href="tel:+2349115754421"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                fontWeight: 300,
                                color: '#060606',
                            }}
                        >
                            +234 911 575 4421
                        </a>
                    </li>
                    <li style={{ marginBottom: '12px' }}>
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
                            Address
                        </p>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                fontWeight: 300,
                                color: '#060606',
                                margin: 0,
                            }}
                        >
                            G5, Landmark Boulevard, Lagos Water Corporation Road, Eti-Osa II,
                            Victoria Island, Lagos
                        </p>
                    </li>
                </ul>
                <p style={bodyStyle}>
                    At HOMÈRE, we are more than just a store; we are your partners in creating a
                    home that exudes elegance, comfort, and individuality. Discover the art of
                    elegant living with Homère Nigeria Limited. Transform your home into a
                    sanctuary of style and comfort today.
                </p>
            </div>
            <StoreLocations />
        </StorefrontShell>
    );
}
