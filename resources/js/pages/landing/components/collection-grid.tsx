import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Collection {
    id: number;
    name: string;
    image: string;
    alt: string;
    slug: string;
    /** Varies tile height for masonry rhythm */
    aspectRatio: string;
}

const collections: Collection[] = [
    {
        id: 1,
        name: 'Home Decor',
        image: '/assets/images/Globe top gold 3.jpg',
        alt: 'Curated home decor including vases, mirrors, and wall art',
        slug: 'home-decor',
        aspectRatio: '4/5',
    },
    {
        id: 2,
        name: 'Home Fragrances',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
        alt: 'Luxury candles and home fragrance collection',
        slug: 'home-fragrances',
        aspectRatio: '3/4',
    },
    {
        id: 3,
        name: 'Home Accessories',
        image: '/assets/images/Globo tray 2.jpg',
        alt: 'Decorative bowls, trays, cushions, and accessories',
        slug: 'home-accessories',
        aspectRatio: '1/1',
    },
    {
        id: 4,
        name: 'Furniture',
        image: '/assets/images/banners/RNI-Films-IMG-A063D280-72CF-4163-B202-E9F064D4A550.jpg',
        alt: 'Designer furniture including sofas, tables, and storage',
        slug: 'furniture',
        aspectRatio: '5/6',
    },
    {
        id: 5,
        name: 'Lighting',
        image: '/assets/images/Golden Chandelier-1.jpg',
        alt: 'Statement lighting including chandeliers and floor lamps',
        slug: 'lighting',
        aspectRatio: '2/3',
    },
    {
        id: 6,
        name: 'New Arrivals',
        image: '/assets/images/Floor lamp Cassini - gold 2.jpg',
        alt: 'Latest additions to the Homère collection',
        slug: 'new-arrivals',
        aspectRatio: '4/5',
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
            className="collections-section"
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
            <div className="collections-masonry">
                {collections.map((col, idx) => (
                    <Link
                        key={col.id}
                        href={
                            col.slug === 'new-arrivals'
                                ? '/shop/new-arrivals'
                                : `/shop/${col.slug}`
                        }
                        className="collections-masonry-item"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
                        }}
                    >
                        <div
                            className="collections-masonry-card"
                            style={{
                                position: 'relative',
                                aspectRatio: col.aspectRatio,
                                overflow: 'hidden',
                                background: '#f5f5f3',
                            }}
                        >
                            <img
                                src={col.image}
                                alt={col.alt}
                                loading="lazy"
                                className="collections-masonry-img"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            <div
                                className="collections-masonry-overlay"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(to top, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.05) 55%, transparent 100%)',
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
                .collections-section {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                    overflow-x: hidden;
                }
                .collections-masonry {
                    column-count: 3;
                    column-gap: 22px;
                    width: 100%;
                }
                .collections-masonry-item {
                    display: block;
                    width: 100%;
                    break-inside: avoid;
                    margin-bottom: 22px;
                    text-decoration: none;
                }
                .collections-masonry-img {
                    transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .collections-masonry-item:hover .collections-masonry-img {
                    transform: scale(1.06);
                }
                .collections-masonry-item:hover .collections-masonry-overlay {
                    background: linear-gradient(
                        to top,
                        rgba(6, 6, 6, 0.72) 0%,
                        rgba(6, 6, 6, 0.12) 50%,
                        transparent 100%
                    );
                }
                @media (max-width: 900px) {
                    .collections-masonry {
                        column-count: 2;
                        column-gap: 16px;
                    }
                    .collections-masonry-item {
                        margin-bottom: 16px;
                    }
                }
                @media (max-width: 480px) {
                    .collections-section {
                        padding: 40px 16px !important;
                    }
                    .collections-masonry {
                        column-count: 2;
                        column-gap: 12px;
                    }
                    .collections-masonry-item {
                        margin-bottom: 12px;
                    }
                }
            `}</style>
        </section>
    );
}
