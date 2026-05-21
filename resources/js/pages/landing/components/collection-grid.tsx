import { Link } from '@inertiajs/react';
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
} from 'react';

interface Collection {
    id: number;
    name: string;
    image: string;
    alt: string;
    slug: string;
    aspectRatio: string;
}

interface TilePlacement {
    column: number;
    rowStart: number;
    rowEnd: number;
}

const ROW_UNIT = 4;
const MOBILE_MAX_WIDTH = 768;
const MOBILE_SLIDE_RATIO = '4/5';

const GRID_IMAGES = [
    '/assets/images/banners/RNI-Films-IMG-A063D280-72CF-4163-B202-E9F064D4A550.jpg',
    '/assets/images/banners/RNI-Films-IMG-E3283BD3-CE56-4F93-80B2-B28B430E385C.jpg',
    '/assets/images/banners/RNI-Films-IMG-17222E29-7C9D-4AA4-B607-37D6B87427D0.JPG',
    '/assets/images/banners/RNI-Films-IMG-06730A17-EBCC-49BF-B433-1D6DDCAB64B3.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-1E93D0CC-A9C3-4726-A217-25008FBBFAEF.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-3F266177-D00E-44A9-AADE-9EAFACA34EB4.JPG.JPG',
];

const MASONRY_RATIOS = [
    '4/5',
    '3/4',
    '1/1',
    '5/6',
    '2/3',
    '4/5',
    '3/4',
    '5/6',
    '4/5',
    '1/1',
    '3/4',
    '4/5',
];

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

function getMasonryConfig(width: number): { columns: number; gap: number } {
    if (width <= MOBILE_MAX_WIDTH) {
        return { columns: 2, gap: 14 };
    }

    if (width <= 1024) {
        return { columns: 3, gap: 18 };
    }

    return { columns: 4, gap: 18 };
}

function heightToRowSpan(heightPx: number, gapPx: number): number {
    let span = 1;

    while (span * ROW_UNIT + (span - 1) * gapPx < heightPx) {
        span += 1;
    }

    return span;
}

function computePlacements(
    containerWidth: number,
    items: Collection[],
): TilePlacement[] {
    const { columns, gap } = getMasonryConfig(containerWidth);
    const colWidth = (containerWidth - gap * (columns - 1)) / columns;
    const placements: TilePlacement[] = [];
    let rowStart = 1;

    for (let bandStart = 0; bandStart < items.length; bandStart += columns) {
        const band = items.slice(bandStart, bandStart + columns);
        const spans = band.map((item) => {
            const [w, h] = item.aspectRatio.split('/').map(Number);

            return heightToRowSpan(colWidth * (h / w), gap);
        });
        const maxSpan = Math.max(...spans, 1);
        const rowEnd = rowStart + maxSpan;

        band.forEach((_, columnIndex) => {
            placements.push({
                column: columnIndex + 1,
                rowStart,
                rowEnd,
            });
        });

        rowStart = rowEnd;
    }

    return placements;
}

const CollectionTile = forwardRef<
    HTMLAnchorElement,
    {
        collection: Collection;
        visible: boolean;
        index: number;
        aspectRatio?: string;
        className: string;
        style?: CSSProperties;
    }
>(function CollectionTile(
    { collection, visible, index, aspectRatio, className, style },
    ref,
) {
    return (
        <Link
            ref={ref}
            href={collectionHref(collection.slug)}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.45s ease ${index * 0.04}s, transform 0.45s ease ${index * 0.04}s`,
                ...style,
            }}
        >
            <div
                className="collections-tile-card"
                style={aspectRatio ? { aspectRatio } : undefined}
            >
                <img
                    src={collection.image}
                    alt={collection.alt}
                    loading="lazy"
                    className="collections-tile-img"
                />
                <div className="collections-tile-overlay">
                    <span className="collections-tile-label">{collection.name}</span>
                </div>
            </div>
        </Link>
    );
});

export default function CollectionsGrid() {
    const [visible, setVisible] = useState(false);
    const [placements, setPlacements] = useState<TilePlacement[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const masonryRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const query = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

        const update = () => setIsMobile(query.matches);

        update();
        query.addEventListener('change', update);

        return () => query.removeEventListener('change', update);
    }, []);

    useLayoutEffect(() => {
        if (isMobile) {
            return;
        }

        const grid = masonryRef.current;

        if (!grid) {
            return;
        }

        const updateLayout = () => {
            const width = grid.clientWidth;

            if (width <= 0) {
                return;
            }

            setPlacements(computePlacements(width, collections));
        };

        updateLayout();

        const observer = new ResizeObserver(updateLayout);
        observer.observe(grid);

        return () => observer.disconnect();
    }, [isMobile]);

    const syncActiveSlide = useCallback(() => {
        const track = sliderRef.current;

        if (!track) {
            return;
        }

        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        slideRefs.current.forEach((slide, index) => {
            if (!slide) {
                return;
            }

            const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
            const distance = Math.abs(slideCenter - trackCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = index;
            }
        });

        setActiveSlide(closest);
    }, []);

    useEffect(() => {
        const track = sliderRef.current;

        if (!isMobile || !track) {
            return;
        }

        syncActiveSlide();
        track.addEventListener('scroll', syncActiveSlide, { passive: true });

        return () => track.removeEventListener('scroll', syncActiveSlide);
    }, [isMobile, syncActiveSlide]);

    const goToSlide = (index: number) => {
        const slide = slideRefs.current[index];

        slide?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
        setActiveSlide(index);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="collections"
            ref={sectionRef}
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

            {isMobile ? (
                <div
                    className="collections-slider"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Shop by category"
                >
                    <div
                        ref={sliderRef}
                        className="collections-slider-track"
                        aria-live="polite"
                    >
                        {collections.map((col, idx) => (
                            <CollectionTile
                                key={col.id}
                                collection={col}
                                visible={visible}
                                index={idx}
                                aspectRatio={MOBILE_SLIDE_RATIO}
                                className="collections-slider-slide"
                                ref={(el) => {
                                    slideRefs.current[idx] = el;
                                }}
                            />
                        ))}
                    </div>

                    <div className="collections-slider-controls">
                        <button
                            type="button"
                            className="collections-slider-nav"
                            onClick={() => goToSlide(activeSlide - 1)}
                            disabled={activeSlide === 0}
                            aria-label="Previous category"
                        >
                            ←
                        </button>
                        <div
                            className="collections-slider-dots"
                            role="tablist"
                            aria-label="Category slides"
                        >
                            {collections.map((col, idx) => (
                                <button
                                    key={col.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={idx === activeSlide}
                                    aria-label={`Show ${col.name}`}
                                    className={`collections-slider-dot${idx === activeSlide ? ' is-active' : ''}`}
                                    onClick={() => goToSlide(idx)}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            className="collections-slider-nav"
                            onClick={() => goToSlide(activeSlide + 1)}
                            disabled={activeSlide === collections.length - 1}
                            aria-label="Next category"
                        >
                            →
                        </button>
                    </div>
                </div>
            ) : (
                <div ref={masonryRef} className="collections-masonry">
                    {collections.map((col, idx) => {
                        const placement = placements[idx];

                        return (
                            <CollectionTile
                                key={col.id}
                                collection={col}
                                visible={visible}
                                index={idx}
                                className="collections-masonry-item"
                                style={
                                    placement
                                        ? {
                                              gridColumn: placement.column,
                                              gridRow: `${placement.rowStart} / ${placement.rowEnd}`,
                                          }
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>
            )}

            <style>{`
                .collections-section {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                    overflow-x: hidden;
                }
                .collections-masonry {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    grid-auto-rows: ${ROW_UNIT}px;
                    gap: 18px;
                    width: 100%;
                }
                .collections-masonry-item,
                .collections-slider-slide {
                    display: flex;
                    min-height: 0;
                    text-decoration: none;
                }
                .collections-tile-card {
                    position: relative;
                    flex: 1;
                    width: 100%;
                    min-height: 0;
                    overflow: hidden;
                    background: #f5f5f3;
                }
                .collections-masonry-item .collections-tile-card {
                    height: 100%;
                }
                .collections-tile-img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .collections-tile-overlay {
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
                    padding: 14px 16px;
                }
                .collections-tile-label {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #ffffff;
                    line-height: 1.3;
                }
                .collections-masonry-item:hover .collections-tile-img,
                .collections-slider-slide:hover .collections-tile-img {
                    transform: scale(1.06);
                }
                .collections-masonry-item:hover .collections-tile-overlay,
                .collections-slider-slide:hover .collections-tile-overlay {
                    background: linear-gradient(
                        to top,
                        rgba(6, 6, 6, 0.72) 0%,
                        rgba(6, 6, 6, 0.12) 50%,
                        transparent 100%
                    );
                }
                .collections-slider {
                    margin: 0 -16px;
                }
                .collections-slider-track {
                    display: flex;
                    gap: 14px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    padding: 0 16px 4px;
                }
                .collections-slider-track::-webkit-scrollbar {
                    display: none;
                }
                .collections-slider-slide {
                    flex: 0 0 min(82vw, 320px);
                    scroll-snap-align: center;
                }
                .collections-slider-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 18px;
                    padding: 0 16px;
                }
                .collections-slider-nav {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    border: 1px solid #e0e0d8;
                    background: #ffffff;
                    color: #060606;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
                }
                .collections-slider-nav:hover:not(:disabled) {
                    background: #f5f5f3;
                    border-color: #060606;
                }
                .collections-slider-nav:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }
                .collections-slider-dots {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 6px;
                    max-width: 220px;
                }
                .collections-slider-dot {
                    width: 6px;
                    height: 6px;
                    padding: 0;
                    border: none;
                    border-radius: 50%;
                    background: #d4d4cc;
                    cursor: pointer;
                    transition: background 0.2s ease, transform 0.2s ease;
                }
                .collections-slider-dot.is-active {
                    background: #060606;
                    transform: scale(1.15);
                }
                @media (max-width: 1024px) {
                    .collections-masonry {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }
                @media (max-width: 480px) {
                    .collections-section {
                        padding: 40px 16px !important;
                    }
                    .collections-tile-overlay {
                        padding: 12px;
                    }
                    .collections-tile-label {
                        font-size: 11px;
                    }
                }
            `}</style>
        </section>
    );
}
