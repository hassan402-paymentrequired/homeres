import { Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

interface Collection {
    id: number;
    name: string;
    image: string;
    alt: string;
    slug: string;
}

const collections: Collection[] = [
    {
        id: 1,
        name: 'Home Decor',
        image: '/assets/images/Globe top gold 3.jpg',
        alt: 'Curated home decor including vases, mirrors, and wall art',
        slug: 'home-decor',
    },
    {
        id: 2,
        name: 'Home Fragrances',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
        alt: 'Luxury candles and home fragrance collection',
        slug: 'home-fragrances',
    },
    {
        id: 3,
        name: 'Home Accessories',
        image: '/assets/images/Globo tray 2.jpg',
        alt: 'Decorative bowls, trays, cushions, and accessories',
        slug: 'home-accessories',
    },
    {
        id: 4,
        name: 'Furniture',
        image: '/assets/images/Crystal cut ashtray 2.jpg',
        alt: 'Designer furniture including sofas, tables, and storage',
        slug: 'furniture',
    },
    {
        id: 5,
        name: 'Lighting',
        image: '/assets/images/Golden Chandelier-1.jpg',
        alt: 'Statement lighting including chandeliers and floor lamps',
        slug: 'lighting',
    },
    {
        id: 6,
        name: 'New Arrivals',
        image: '/assets/images/Floor lamp Cassini - gold 2.jpg',
        alt: 'Latest additions to the Homère collection',
        slug: 'new-arrivals',
    },
];

export default function CollectionsGrid() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="collections"
            ref={ref}
            style={{ padding: '48px 30px', maxWidth: '1500px', margin: '0 auto' }}
        >
            <h2
                style={{
                    fontFamily: '"Proza Libre", sans-serif',
                    fontSize: 'calc(29px * 0.63)',
                    fontWeight: 500,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                    color: '#060606',
                    lineHeight: 1.1,
                    margin: '0 0 28px',
                    textAlign: 'center',
                }}
            >
                Shop by Category
            </h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '22px',
                }}
                className="collections-grid"
            >
                {collections.map((col, idx) => (
                    <Link
                        key={col.id}
                        href={
                            col.slug === 'new-arrivals'
                                ? '/shop/new-arrivals'
                                : `/shop/${col.slug}`
                        }
                        style={{
                            textDecoration: 'none',
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                aspectRatio: '4/5',
                                overflow: 'hidden',
                                background: '#f5f5f3',
                            }}
                        >
                            <img
                                src={col.image}
                                alt={col.alt}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(to top, rgba(6,6,6,0.55) 0%, transparent 60%)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '20px',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: '"Proza Libre", sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: '#ffffff',
                                    }}
                                >
                                    {col.name}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .collections-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 560px) {
                    .collections-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
