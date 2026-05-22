import { Link } from '@inertiajs/react';
import {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Collection {
    id: number;
    name: string;
    image: string;
    alt: string;
    slug: string;
}

const GRID_IMAGES = [
    // '/assets/images/banners/RNI-Films-IMG-A063D280-72CF-4163-B202-E9F064D4A550.jpg',
    '/assets/images/banners/RNI-Films-IMG-E3283BD3-CE56-4F93-80B2-B28B430E385C.jpg',
    '/assets/images/banners/RNI-Films-IMG-17222E29-7C9D-4AA4-B607-37D6B87427D0.JPG',
    '/assets/images/banners/RNI-Films-IMG-06730A17-EBCC-49BF-B433-1D6DDCAB64B3.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-1E93D0CC-A9C3-4726-A217-25008FBBFAEF.JPG.JPG',
    '/assets/images/banners/RNI-Films-IMG-3F266177-D00E-44A9-AADE-9EAFACA34EB4.JPG.JPG',
];

const CATEGORY_COLLECTIONS: Omit<Collection, 'id'>[] = [
    {
        name: 'Home Decor',
        image: '/assets/images/Baobab Rainforest Amazonia max 10.jpg',
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
    }
];

const collections: Collection[] = [
    ...CATEGORY_COLLECTIONS.map((item, i) => ({ id: i + 1, ...item })),
];

function collectionHref(slug: string): string {
    return slug === 'new-arrivals' ? '/shop/new-arrivals' : `/shop/${slug}`;
}

// ─── Staggered row config ─────────────────────────────────────────────────────
//
// Each row is an array of flex-basis values (must sum to ~100%).
// We chunk the collections into rows using this pattern, repeating as needed.
//
const ROW_PATTERNS = [
    ['60%', '40%'],          // row 1: wide left
    ['35%', '35%', '30%'],   // row 2: three equal-ish
    ['40%', '60%'],          // row 3: wide right
    ['25%', '50%', '25%'],   // row 4: centred hero
];

// Row heights (desktop). Alternating keeps things rhythmic but varied.
const ROW_HEIGHTS = [260, 200, 240, 220];

function buildRows(items: Collection[]): { item: Collection; basis: string }[][] {
    const rows: { item: Collection; basis: string }[][] = [];
    let cursor = 0;
    let patternIdx = 0;

    while (cursor < items.length) {
        const pattern = ROW_PATTERNS[patternIdx % ROW_PATTERNS.length];
        const rowItems = items.slice(cursor, cursor + pattern.length);
        if (rowItems.length === 0) break;

        // If the last row has fewer items than the pattern, spread them evenly
        const bases =
            rowItems.length === pattern.length
                ? pattern
                : rowItems.map(() => `${(100 / rowItems.length).toFixed(2)}%`);

        rows.push(rowItems.map((item, i) => ({ item, basis: bases[i] })));
        cursor += rowItems.length;
        patternIdx++;
    }

    return rows;
}

// ─── Tile ─────────────────────────────────────────────────────────────────────

const CollectionTile = forwardRef<
    HTMLAnchorElement,
    {
        collection: Collection;
        basis: string;
        rowHeight: number;
        visible: boolean;
        index: number;
        className?: string;
        style?: CSSProperties;
    }
>(function CollectionTile(
    { collection, basis, rowHeight, visible, index, className = '', style },
    ref,
) {
    return (
        <Link
            ref={ref}
            href={collectionHref(collection.slug)}
            className={`group relative block shrink-0 overflow-hidden rounded-[14px] ${className}`}
            style={{
                flexBasis: basis,
                height: rowHeight,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${index * 0.045}s, transform 0.5s ease ${index * 0.045}s`,
                ...style,
            }}
        >
            {/* Image */}
            <img
                src={collection.image}
                alt={collection.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/75 group-hover:via-black/15" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <span
                    className="font-['Proza_Libre',sans-serif] text-[11px] font-medium uppercase tracking-[0.13em] text-white"
                    style={{ lineHeight: 1.3 }}
                >
                    {collection.name}
                </span>
                {/* Subtle arrow that appears on hover */}
                <span className="translate-x-2 text-white/0 text-xs tracking-widest opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/80 group-hover:opacity-100">
                    →
                </span>
            </div>
        </Link>
    );
});

// ─── Mobile slider tile ───────────────────────────────────────────────────────

const SliderTile = forwardRef<
    HTMLAnchorElement,
    {
        collection: Collection;
        visible: boolean;
        index: number;
    }
>(function SliderTile({ collection, visible, index }, ref) {
    return (
        <Link
            ref={ref}
            href={collectionHref(collection.slug)}
            className="group relative block shrink-0 snap-center overflow-hidden rounded-[14px]"
            style={{
                flexBasis: 'min(82vw, 300px)',
                aspectRatio: '5/4',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`,
            }}
        >
            <img
                src={collection.image}
                alt={collection.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/05 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
                <span className="font-['Proza_Libre',sans-serif] text-[11px] font-medium uppercase tracking-[0.12em] text-white">
                    {collection.name}
                </span>
            </div>
        </Link>
    );
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function CollectionsGrid() {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const rows = buildRows(collections);

    // ── Responsive detection ──────────────────────────────────────────────────
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    // ── Mobile slider scroll sync ─────────────────────────────────────────────
    const syncActiveSlide = useCallback(() => {
        const track = sliderRef.current;
        if (!track) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        slideRefs.current.forEach((slide, i) => {
            if (!slide) return;
            const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
            if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        setActiveSlide(closest);
    }, []);

    useEffect(() => {
        const track = sliderRef.current;
        if (!isMobile || !track) return;
        syncActiveSlide();
        track.addEventListener('scroll', syncActiveSlide, { passive: true });
        return () => track.removeEventListener('scroll', syncActiveSlide);
    }, [isMobile, syncActiveSlide]);

    const goToSlide = (index: number) => {
        slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveSlide(index);
    };

    // ── Intersection reveal ───────────────────────────────────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // ── Running tile index for stagger delay ──────────────────────────────────
    let tileIndex = 0;

    return (
        <section
            id="collections"
            ref={sectionRef}
            className="mx-auto w-full max-w-[1500px] px-[30px] py-12"
        >
            {/* Heading */}
            <h2
                className="mb-8 text-center font-['Proza_Libre',sans-serif] font-medium uppercase tracking-[0.025em] text-[#060606]"
                style={{ fontSize: 'calc(29px * 0.63)', lineHeight: 1.1 }}
            >
                Shop by Category
            </h2>

            {/* ── Mobile slider ──────────────────────────────────────────── */}
            {isMobile ? (
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Shop by category"
                    className="-mx-4"
                >
                    {/* Track */}
                    <div
                        ref={sliderRef}
                        aria-live="polite"
                        className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                    >
                        {collections.map((col, idx) => (
                            <SliderTile
                                key={col.id}
                                collection={col}
                                visible={visible}
                                index={idx}
                                ref={(el) => { slideRefs.current[idx] = el; }}
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="mt-[18px] flex items-center justify-center gap-3 px-4">
                        <button
                            type="button"
                            onClick={() => goToSlide(activeSlide - 1)}
                            disabled={activeSlide === 0}
                            aria-label="Previous category"
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#e0e0d8] bg-white text-sm text-[#060606] transition-colors hover:border-[#060606] hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            ←
                        </button>

                        <div
                            role="tablist"
                            aria-label="Category slides"
                            className="flex max-w-[220px] flex-wrap justify-center gap-[6px]"
                        >
                            {collections.map((col, idx) => (
                                <button
                                    key={col.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={idx === activeSlide}
                                    aria-label={`Show ${col.name}`}
                                    onClick={() => goToSlide(idx)}
                                    className={`h-[6px] w-[6px] rounded-full border-none p-0 transition-all duration-200 ${
                                        idx === activeSlide
                                            ? 'scale-[1.15] bg-[#060606]'
                                            : 'bg-[#d4d4cc]'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => goToSlide(activeSlide + 1)}
                            disabled={activeSlide === collections.length - 1}
                            aria-label="Next category"
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#e0e0d8] bg-white text-sm text-[#060606] transition-colors hover:border-[#060606] hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            →
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Desktop staggered editorial grid ───────────────────── */
                <div className="flex flex-col gap-[10px]">
                    {rows.map((row, rowIdx) => {
                        const rowHeight = ROW_HEIGHTS[rowIdx % ROW_HEIGHTS.length];
                        return (
                            <div key={rowIdx} className="flex gap-[10px]">
                                {row.map(({ item, basis }) => {
                                    const idx = tileIndex++;
                                    return (
                                        <CollectionTile
                                            key={item.id}
                                            collection={item}
                                            basis={basis}
                                            rowHeight={rowHeight}
                                            visible={visible}
                                            index={idx}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}