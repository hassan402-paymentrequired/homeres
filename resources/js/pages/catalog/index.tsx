import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import ProductCard from '@/components/storefront/product-card';
import StorefrontPagination from '@/components/storefront/storefront-pagination';
import StorefrontShell from '@/components/storefront/storefront-shell';
import {
    buildCatalogUrl,
    type CatalogFilters,
    type SortOption,
} from '@/pages/catalog/catalog-query';
import type { Paginated } from '@/types/pagination';
import type { StorefrontProduct } from '@/types/storefront-product';

type CatalogView = 'shop' | 'category' | 'collection' | 'brand' | 'brands' | 'new';

type SidebarCategory = {
    label: string;
    handle: string;
    href: string;
};

type CategoryContext = {
    handle: string;
    label: string;
    children: { label: string; handle: string }[];
};

type BrandDirectoryEntry = {
    name: string;
    handle: string;
    href: string;
};

type CatalogMeta = {
    view: CatalogView;
    title: string;
    description: string | null;
    basePath: string;
    filters: CatalogFilters;
    sidebarCategories: SidebarCategory[];
    categoryContext: CategoryContext | null;
    brands?: BrandDirectoryEntry[];
};

interface CatalogPageProps {
    products: Paginated<StorefrontProduct>;
    catalog: CatalogMeta;
}

type ViewMode = 'grid' | 'list';

const PRICE_CEILING = 5_000_000;

const chipStyle = (active: boolean): CSSProperties => ({
    flexShrink: 0,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: active ? 500 : 300,
    letterSpacing: '0.3px',
    padding: '8px 14px',
    border: `1px solid ${active ? '#060606' : '#e8e8e1'}`,
    background: active ? '#060606' : '#ffffff',
    color: active ? '#ffffff' : '#6b6b6b',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
});

function FilterChip({
    active,
    href,
    children,
}: {
    active: boolean;
    href: string;
    children: ReactNode;
}) {
    return (
        <Link href={href} style={chipStyle(active)}>
            {children}
        </Link>
    );
}

function CatalogRefineFilters({
    newOnly,
    maxPrice,
    onNewOnlyChange,
    onMaxPriceChange,
}: {
    newOnly: boolean;
    maxPrice: number | null;
    onNewOnlyChange: (value: boolean) => void;
    onMaxPriceChange: (value: number | null) => void;
}) {
    return (
        <>
            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                }}
            >
                <input
                    type="checkbox"
                    checked={newOnly}
                    onChange={(e) => onNewOnlyChange(e.target.checked)}
                />
                New only
            </label>
            <label
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    display: 'block',
                    marginBottom: '6px',
                }}
            >
                Max price:{' '}
                {maxPrice ? `₦${maxPrice.toLocaleString('en-NG')}` : 'Any'}
            </label>
            <input
                type="range"
                min={50000}
                max={PRICE_CEILING}
                step={50000}
                value={maxPrice ?? PRICE_CEILING}
                onChange={(e) =>
                    onMaxPriceChange(
                        Number(e.target.value) >= PRICE_CEILING
                            ? null
                            : Number(e.target.value),
                    )
                }
                style={{ width: '100%' }}
            />
        </>
    );
}

function BrandsDirectory({ brands }: { brands: BrandDirectoryEntry[] }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
            }}
        >
            {brands.map((brand) => (
                <Link
                    key={brand.handle}
                    href={brand.href}
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        padding: '14px 16px',
                        border: '1px solid #e8e8e1',
                        color: '#060606',
                        textDecoration: 'none',
                    }}
                >
                    {brand.name}
                </Link>
            ))}
        </div>
    );
}

export default function CatalogPage({ products, catalog }: CatalogPageProps) {
    const { filters, basePath, view, categoryContext, sidebarCategories } = catalog;
    const isBrandDirectory = view === 'brands';
    const isNewPage = filters.filter === 'new';
    const activeCategory = filters.category;
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [draftNewOnly, setDraftNewOnly] = useState(filters.new_only);
    const [draftMaxPrice, setDraftMaxPrice] = useState<number | null>(filters.max_price);

    useEffect(() => {
        setDraftNewOnly(filters.new_only);
        setDraftMaxPrice(filters.max_price);
    }, [filters.new_only, filters.max_price]);

    useEffect(() => {
        if (!filtersOpen) {
            return;
        }

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prev;
        };
    }, [filtersOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setFiltersOpen(false);
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const visitCatalog = (overrides: Partial<CatalogFilters> = {}) => {
        router.get(buildCatalogUrl(basePath, filters, overrides), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const pageTitle = filters.q?.trim()
        ? `Search: ${filters.q}`
        : catalog.title;

    const pageDescription =
        isNewPage
            ? 'The latest additions to our curated collection.'
            : catalog.description ?? 'Browse our full catalogue of luxury home decor.';

    const activeFilterCount =
        (filters.new_only ? 1 : 0) +
        (filters.max_price !== null ? 1 : 0) +
        (filters.sub ? 1 : 0);

    const clearRefineFilters = () => {
        visitCatalog({ new_only: false, max_price: null, sub: null });
    };

    const subcategoryUrl = (handle: string | null) =>
        buildCatalogUrl(basePath, filters, { sub: handle });

    const categoryChips = (
        <>
            <FilterChip
                active={view === 'shop' && !filters.q}
                href="/shop"
            >
                All
            </FilterChip>
            <FilterChip active={isNewPage} href="/shop/new-arrivals">
                New
            </FilterChip>
            {sidebarCategories.map((cat) => (
                <FilterChip
                    key={cat.handle}
                    active={activeCategory === cat.handle}
                    href={cat.href}
                >
                    {cat.label}
                </FilterChip>
            ))}
        </>
    );

    const subcategoryChips = categoryContext ? (
        <div className="catalog-chip-row catalog-type-row" aria-label="Product type">
            <FilterChip active={!filters.sub} href={subcategoryUrl(null)}>
                All {categoryContext.label}
            </FilterChip>
            {categoryContext.children.map((child) => (
                <FilterChip
                    key={child.handle}
                    active={filters.sub === child.handle}
                    href={subcategoryUrl(child.handle)}
                >
                    {child.label}
                </FilterChip>
            ))}
        </div>
    ) : null;

    return (
        <StorefrontShell>
            <Head title={pageTitle} />
            <div className="catalog-page" style={{ maxWidth: '1500px', margin: '0 auto', padding: '48px 30px' }}>
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            color: '#999',
                            textDecoration: 'none',
                        }}
                    >
                        Home
                    </Link>
                    <span style={{ color: '#ccc' }}>/</span>
                    <Link
                        href="/shop"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            color: view !== 'shop' || isNewPage ? '#999' : '#060606',
                            textDecoration: 'none',
                        }}
                    >
                        Shop
                    </Link>
                    {view !== 'shop' && (
                        <>
                            <span style={{ color: '#ccc' }}>/</span>
                            <span
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    color: '#060606',
                                }}
                            >
                                {pageTitle}
                            </span>
                        </>
                    )}
                </nav>

                <div
                    className="catalog-header"
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginBottom: '32px',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: 'calc(29px * 0.85)',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                color: '#060606',
                                margin: '0 0 8px',
                            }}
                        >
                            {pageTitle}
                        </h1>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '13px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                margin: 0,
                                maxWidth: '520px',
                            }}
                        >
                            {pageDescription}{' '}
                            {!isBrandDirectory && (
                                <span style={{ color: '#999' }}>
                                    ({products.total} products)
                                </span>
                            )}
                        </p>
                    </div>
                    {!isBrandDirectory && (
                        <div className="catalog-toolbar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <select
                                value={filters.sort}
                                onChange={(e) =>
                                    visitCatalog({ sort: e.target.value as SortOption })
                                }
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    padding: '10px 14px',
                                    border: '1px solid #e8e8e1',
                                    background: '#fff',
                                }}
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name: A–Z</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #e8e8e1',
                                    background: viewMode === 'grid' ? '#060606' : '#fff',
                                    color: viewMode === 'grid' ? '#fff' : '#060606',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                }}
                            >
                                Grid
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #e8e8e1',
                                    background: viewMode === 'list' ? '#060606' : '#fff',
                                    color: viewMode === 'list' ? '#fff' : '#060606',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                }}
                            >
                                List
                            </button>
                        </div>
                    )}
                </div>

                {isBrandDirectory && catalog.brands ? (
                    <BrandsDirectory brands={catalog.brands} />
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)',
                            gap: '40px',
                        }}
                        className="catalog-layout catalog-main"
                    >
                        <div className="catalog-mobile-filters">
                            <div className="catalog-chip-row" aria-label="Categories">
                                {categoryChips}
                            </div>
                            {subcategoryChips}
                            <div className="catalog-mobile-actions">
                                <button
                                    type="button"
                                    className="catalog-filters-trigger"
                                    onClick={() => setFiltersOpen(true)}
                                    aria-expanded={filtersOpen}
                                >
                                    Filters
                                    {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                                </button>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        className="catalog-filters-clear"
                                        onClick={clearRefineFilters}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <aside className="catalog-sidebar">
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    margin: '0 0 12px',
                                }}
                            >
                                Categories
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link
                                        href="/shop"
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            color: view === 'shop' && !filters.q ? '#060606' : '#6b6b6b',
                                            fontWeight: view === 'shop' && !filters.q ? 500 : 300,
                                        }}
                                    >
                                        All products
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link
                                        href="/shop/new-arrivals"
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            color: isNewPage ? '#060606' : '#6b6b6b',
                                            fontWeight: isNewPage ? 500 : 300,
                                        }}
                                    >
                                        New arrivals
                                    </Link>
                                </li>
                                {sidebarCategories.map((cat) => (
                                    <li key={cat.handle} style={{ marginBottom: '8px' }}>
                                        <Link
                                            href={cat.href}
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                color:
                                                    activeCategory === cat.handle
                                                        ? '#060606'
                                                        : '#6b6b6b',
                                                fontWeight:
                                                    activeCategory === cat.handle ? 500 : 300,
                                            }}
                                        >
                                            {cat.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    margin: '24px 0 12px',
                                }}
                            >
                                Refine
                            </p>
                            <div style={{ marginBottom: '24px' }}>
                                <CatalogRefineFilters
                                    newOnly={filters.new_only}
                                    maxPrice={filters.max_price}
                                    onNewOnlyChange={(value) => visitCatalog({ new_only: value })}
                                    onMaxPriceChange={(value) => visitCatalog({ max_price: value })}
                                />
                            </div>
                            {categoryContext && (
                                <>
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            letterSpacing: '2px',
                                            textTransform: 'uppercase',
                                            margin: '0 0 12px',
                                        }}
                                    >
                                        Type
                                    </p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={{ marginBottom: '6px' }}>
                                            <Link
                                                href={subcategoryUrl(null)}
                                                style={{
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    color: !filters.sub ? '#060606' : '#999',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                All {categoryContext.label}
                                            </Link>
                                        </li>
                                        {categoryContext.children.map((child) => (
                                            <li key={child.handle} style={{ marginBottom: '6px' }}>
                                                <Link
                                                    href={subcategoryUrl(child.handle)}
                                                    style={{
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '11px',
                                                        color:
                                                            filters.sub === child.handle
                                                                ? '#060606'
                                                                : '#999',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </aside>

                        <div>
                            {products.data.length === 0 ? (
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '14px',
                                        color: '#6b6b6b',
                                    }}
                                >
                                    No products match your filters.
                                </p>
                            ) : (
                                <div
                                    style={
                                        viewMode === 'list'
                                            ? {
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  gap: '16px',
                                              }
                                            : {
                                                  display: 'grid',
                                                  gridTemplateColumns: 'repeat(4, 1fr)',
                                                  gap: '22px',
                                              }
                                    }
                                    className={
                                        viewMode === 'grid' ? 'catalog-grid' : 'catalog-list'
                                    }
                                >
                                    {products.data.map((product, idx) => (
                                        <ProductCard key={product.id} product={product} index={idx} />
                                    ))}
                                </div>
                            )}

                            <StorefrontPagination paginator={products} />
                        </div>
                    </div>
                )}
            </div>

            {filtersOpen && (
                <div
                    className="catalog-filter-overlay"
                    role="presentation"
                    onClick={() => setFiltersOpen(false)}
                >
                    <div
                        className="catalog-filter-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Filters"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '18px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    margin: 0,
                                    color: '#060606',
                                }}
                            >
                                Refine
                            </p>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                aria-label="Close filters"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                    color: '#060606',
                                    padding: '4px',
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <CatalogRefineFilters
                            newOnly={draftNewOnly}
                            maxPrice={draftMaxPrice}
                            onNewOnlyChange={setDraftNewOnly}
                            onMaxPriceChange={setDraftMaxPrice}
                        />

                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                className="catalog-filters-clear"
                                onClick={clearRefineFilters}
                                style={{ marginTop: '20px' }}
                            >
                                Reset refine
                            </button>
                        )}

                        <button
                            type="button"
                            className="catalog-filters-apply"
                            onClick={() => {
                                visitCatalog({
                                    new_only: draftNewOnly,
                                    max_price: draftMaxPrice,
                                });
                                setFiltersOpen(false);
                            }}
                        >
                            Show results
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .catalog-page {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                .catalog-layout {
                    min-width: 0;
                }
                .catalog-mobile-filters { display: none; }
                .catalog-filter-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 150;
                    background: rgba(6, 6, 6, 0.45);
                }
                .catalog-filter-drawer {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: min(320px, 88vw);
                    background: #ffffff;
                    padding: 24px 20px 32px;
                    overflow-y: auto;
                    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
                }
                .catalog-filters-trigger,
                .catalog-filters-apply {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    padding: 12px 16px;
                    border: 1px solid #060606;
                    background: #060606;
                    color: #ffffff;
                    cursor: pointer;
                }
                .catalog-filters-clear {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 400;
                    letter-spacing: 0.5px;
                    padding: 12px 16px;
                    border: 1px solid #e8e8e1;
                    background: #ffffff;
                    color: #6b6b6b;
                    cursor: pointer;
                }
                .catalog-filters-apply {
                    width: 100%;
                    margin-top: 28px;
                }
                @media (max-width: 1100px) {
                    .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 900px) {
                    .catalog-page {
                        overflow-x: hidden;
                    }
                    .catalog-layout {
                        grid-template-columns: minmax(0, 1fr) !important;
                        gap: 20px !important;
                    }
                    .catalog-layout > * {
                        min-width: 0;
                    }
                    .catalog-sidebar { display: none !important; }
                    .catalog-mobile-filters {
                        display: block !important;
                        width: 100%;
                        max-width: 100%;
                        min-width: 0;
                        overflow: hidden;
                    }
                    .catalog-chip-row {
                        display: flex;
                        gap: 8px;
                        width: 100%;
                        max-width: 100%;
                        min-width: 0;
                        overflow-x: auto;
                        overflow-y: hidden;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        padding-bottom: 4px;
                    }
                    .catalog-chip-row::-webkit-scrollbar { display: none; }
                    .catalog-type-row { margin-top: 10px; }
                    .catalog-mobile-actions {
                        display: flex;
                        gap: 8px;
                        margin-top: 12px;
                        min-width: 0;
                    }
                    .catalog-filters-trigger { flex: 1; min-width: 0; }
                    .catalog-grid,
                    .catalog-list {
                        min-width: 0;
                        width: 100%;
                    }
                    .catalog-page { padding: 32px 20px !important; }
                    .catalog-header { flex-direction: column !important; align-items: stretch !important; }
                    .catalog-header h1 { font-size: calc(29px * 0.7) !important; }
                    .catalog-toolbar { width: 100%; }
                    .catalog-toolbar select,
                    .catalog-toolbar button { flex: 1; min-width: 0; }
                }
                @media (max-width: 640px) {
                    .catalog-page { padding: 24px 16px !important; }
                    .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
                    .catalog-toolbar { flex-direction: column !important; }
                    .catalog-toolbar select,
                    .catalog-toolbar button { width: 100% !important; }
                    .catalog-list > * { flex-direction: column !important; }
                    .catalog-list img { width: 100% !important; max-width: none !important; }
                }
                @media (max-width: 400px) {
                    .catalog-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
