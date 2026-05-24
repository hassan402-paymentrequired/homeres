import { Link } from '@inertiajs/react';
import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from 'react';

export type ShopCollection = {
    id: string;
    name: string;
    slug: string;
    image: string;
    alt: string;
    productCount: number;
};

type Props = {
    collections: ShopCollection[];
};

function collectionHref(slug: string): string {
    return `/shop/${slug}`;
}

// ─── Staggered row config ─────────────────────────────────────────────────────

const ROW_PATTERNS = [
    ['60%', '40%'],
    ['35%', '35%', '30%'],
    ['40%', '60%'],
    ['25%', '50%', '25%'],
];

const ROW_HEIGHTS = [260, 200, 240, 220];

function buildRows(
    items: ShopCollection[],
): { item: ShopCollection; basis: string }[][] {
    const rows: { item: ShopCollection; basis: string }[][] = [];
    let cursor = 0;
    let patternIdx = 0;

    while (cursor < items.length) {
        const pattern = ROW_PATTERNS[patternIdx % ROW_PATTERNS.length];
        const rowItems = items.slice(cursor, cursor + pattern.length);
        if (rowItems.length === 0) {
            break;
        }

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
        collection: ShopCollection;
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
            <img
                src={collection.image}
                alt={collection.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/75 group-hover:via-black/15" />

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <span
                    className="font-['Proza_Libre',sans-serif] text-[11px] font-medium uppercase tracking-[0.13em] text-white"
                    style={{ lineHeight: 1.3 }}
                >
                    {collection.name}
                </span>
                <span className="translate-x-2 text-xs tracking-widest text-white/0 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/80 group-hover:opacity-100">
                    →
                </span>
            </div>
        </Link>
    );
});

const SliderTile = forwardRef<
    HTMLAnchorElement,
    {
        collection: ShopCollection;
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

export default function CollectionsGrid({ collections }: Props) {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const sectionRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const rows = useMemo(() => buildRows(collections), [collections]);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const syncActiveSlide = useCallback(() => {
        const track = sliderRef.current;
        if (!track) {
            return;
        }
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        slideRefs.current.forEach((slide, i) => {
            if (!slide) {
                return;
            }
            const dist = Math.abs(
                slide.offsetLeft + slide.offsetWidth / 2 - center,
            );
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
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
    }, [isMobile, syncActiveSlide, collections.length]);

    const goToSlide = (index: number) => {
        slideRefs.current[index]?.scrollIntoView({
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

    let tileIndex = 0;

    if (collections.length === 0) {
        return null;
    }

    return (
        <section
            id="collections"
            ref={sectionRef}
            className="mx-auto w-full max-w-[1500px] px-[30px] py-12"
        >
            <h2
                className="mb-8 text-center font-['Proza_Libre',sans-serif] font-medium uppercase tracking-[0.025em] text-[#060606]"
                style={{ fontSize: 'calc(29px * 0.63)', lineHeight: 1.1 }}
            >
                Shop by Category
            </h2>

            {isMobile ? (
                <div
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Shop by category"
                    className="-mx-4"
                >
                    <div
                        ref={sliderRef}
                        aria-live="polite"
                        className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {collections.map((col, idx) => (
                            <SliderTile
                                key={col.id}
                                collection={col}
                                visible={visible}
                                index={idx}
                                ref={(el) => {
                                    slideRefs.current[idx] = el;
                                }}
                            />
                        ))}
                    </div>

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
                <div className="flex flex-col gap-[10px]">
                    {rows.map((row, rowIdx) => {
                        const rowHeight =
                            ROW_HEIGHTS[rowIdx % ROW_HEIGHTS.length];
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
