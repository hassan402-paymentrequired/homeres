import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Collection {
    id: number;
    name: string;
    image: string;
    alt: string;
    slug: string;
    aspectRatio: string;
}

const GRID_IMAGES = [
    '/assets/images/banners/RNI-Films-IMG-A063D280-72CF-4163-B202-E9F064D4A550.jpg',
    '/assets/images/banners/RNI-Films-IMG-E3283BD3-CE56-4F93-80B2-B28B430E385C.jpg',
    '/assets/images/banners/RNI-Films-IMG-17222E29-7C9D-4AA4-B607-37D6B87427D0.JPG',
    '/assets/images/banners/RNI-Films-IMG-06730A17-EBCC-49BF-B433-1D6DDCAB64B3.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-1E93D0CC-A9C3-4726-A217-25008FBBFAEF.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-3F266177-D00E-44A9-AADE-9EAFACA34EB4.JPG.JPG',
];

const MASONRY_RATIOS = ['4/5', '3/4', '1/1', '5/6', '2/3', '4/5', '3/4', '5/6', '4/5', '1/1', '3/4', '4/5'];

const BRAND_SLUGS: { slug: string; name: string }[] = [
    { slug: 'fornasetti', name: 'Fornasetti' },
    { slug: 'gaggenau', name: 'Gaggenau' },
    { slug: 'glas-italia', name: 'Glas Italia' },
    { slug: 'guaxs', name: 'Guaxs' },
    { slug: 'helle-mardahl-studio', name: 'Helle Mardahl Studio' },
    { slug: 'jonathan-adler', name: 'Jonathan Adler' },
];

const CATEGORY_COLLECTIONS: Omit<Collection, 'id' | 'aspectRatio'>[] = [
    {
        name: 'Home Decor',
        image: '/assets/images/Globe top gold 3.jpg',
        alt: 'Curated home decor including vases, mirrors, and wall art',
        slug: 'home-decor',
    },
    {
        name: 'Home Fragrances',
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
        alt: 'Luxury candles and home fragrance collection',
        slug: 'home-fragrances',
    },
    {
        name: 'Home Accessories',
        image: '/assets/images/Globo tray 2.jpg',
        alt: 'Decorative bowls, trays, cushions, and accessories',
        slug: 'home-accessories',
    },
    {
        name: 'Furniture',
        image: GRID_IMAGES[0],
        alt: 'Designer furniture including sofas, tables, and storage',
        slug: 'furniture',
    },
    {
        name: 'Lighting',
        image: '/assets/images/Golden Chandelier-1.jpg',
        alt: 'Statement lighting including chandeliers and floor lamps',
        slug: 'lighting',
    },
    {
        name: 'New Arrivals',
        image: '/assets/images/Floor lamp Cassini - gold 2.jpg',
        alt: 'Latest additions to the Homère collection',
        slug: 'new-arrivals',
    },
];

const collections: Collection[] = [
    ...CATEGORY_COLLECTIONS.map((item, index) => ({
        id: index + 1,
        ...item,
        aspectRatio: MASONRY_RATIOS[index],
    })),
    ...BRAND_SLUGS.map((brand, index) => ({
        id: CATEGORY_COLLECTIONS.length + index + 1,
        name: brand.name,
        slug: brand.slug,
        alt: `${brand.name} collection at Homère`,
        image: GRID_IMAGES[(CATEGORY_COLLECTIONS.length + index) % GRID_IMAGES.length],
        aspectRatio: MASONRY_RATIOS[CATEGORY_COLLECTIONS.length + index],
    })),
];

function collectionHref(slug: string): string {
    return slug === 'new-arrivals' ? '/shop/new-arrivals' : `/shop/${slug}`;
}

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
                        href={collectionHref(col.slug)}
                        className="collections-masonry-item"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(16px)',
                            transition: `opacity 0.45s ease ${idx * 0.04}s, transform 0.45s ease ${idx * 0.04}s`,
                        }}
                    >
                        <div
                            className="collections-masonry-card"
                            style={{ aspectRatio: col.aspectRatio }}
                        >
                            <img
                                src={col.image}
                                alt={col.alt}
                                loading="lazy"
                                className="collections-masonry-img"
                            />
                            <div className="collections-masonry-overlay">
                                <span className="collections-masonry-label">{col.name}</span>
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
                    column-count: 4;
                    column-gap: 18px;
                    width: 100%;
                }
                .collections-masonry-item {
                    display: block;
                    width: 100%;
                    break-inside: avoid;
                    margin-bottom: 18px;
                    text-decoration: none;
                }
                .collections-masonry-card {
                    position: relative;
                    overflow: hidden;
                    background: #f5f5f3;
                }
                .collections-masonry-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .collections-masonry-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(6, 6, 6, 0.62) 0%,
                        rgba(6, 6, 6, 0.05) 55%,
                        transparent 100%
                    );
                    display: flex;
                    align-items: flex-end;
                    padding: 16px;
                }
                .collections-masonry-label {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #ffffff;
                    line-height: 1.3;
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
                @media (max-width: 1024px) {
                    .collections-masonry {
                        column-count: 3;
                    }
                }
                @media (max-width: 768px) {
                    .collections-masonry {
                        column-count: 2;
                        column-gap: 14px;
                    }
                    .collections-masonry-item {
                        margin-bottom: 14px;
                    }
                }
                @media (max-width: 480px) {
                    .collections-section {
                        padding: 40px 16px !important;
                    }
                    .collections-masonry {
                        gap: 12px;
                    }
                    .collections-masonry-item {
                        margin-bottom: 12px;
                    }
                    .collections-masonry-overlay {
                        padding: 12px;
                    }
                    .collections-masonry-label {
                        font-size: 11px;
                    }
                }
            `}</style>
        </section>
    );
}
