import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import ProductCard from '@/components/storefront/product-card';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { CATEGORIES, findCategory } from '@/data/categories';
import {
    MOCK_PRODUCTS,
    getNewArrivals,
    getProductsByCategory,
    type MockProduct,
} from '@/data/mock-products';

interface CatalogPageProps {
    category?: string | null;
    filter?: 'new' | null;
    sub?: string | null;
    q?: string | null;
}

type ViewMode = 'grid' | 'list';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

function sortProducts(products: MockProduct[], sort: SortOption): MockProduct[] {
    const copy = [...products];

    switch (sort) {
        case 'price-asc':
            return copy.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return copy.sort((a, b) => b.price - a.price);
        case 'name':
            return copy.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return copy;
    }
}

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
    onClick,
    children,
}: {
    active: boolean;
    href?: string;
    onClick?: () => void;
    children: ReactNode;
}) {
    const style = chipStyle(active);

    if (href) {
        return (
            <Link href={href} style={style}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                ...style,
                border: `1px solid ${active ? '#060606' : '#e8e8e1'}`,
            }}
        >
            {children}
        </button>
    );
}

function CatalogRefineFilters({
    newOnly,
    setNewOnly,
    maxPrice,
    setMaxPrice,
    priceCeiling,
}: {
    newOnly: boolean;
    setNewOnly: (value: boolean) => void;
    maxPrice: number | null;
    setMaxPrice: (value: number | null) => void;
    priceCeiling: number;
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
                    onChange={(e) => setNewOnly(e.target.checked)}
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
                max={priceCeiling}
                step={50000}
                value={maxPrice ?? priceCeiling}
                onChange={(e) =>
                    setMaxPrice(
                        Number(e.target.value) >= priceCeiling
                            ? null
                            : Number(e.target.value),
                    )
                }
                style={{ width: '100%' }}
            />
        </>
    );
}

export default function CatalogPage({
    category = null,
    filter = null,
    sub = null,
    q = null,
}: CatalogPageProps) {
    const [sort, setSort] = useState<SortOption>('featured');
    const [subcategory, setSubcategory] = useState<string | null>(sub);
    const [newOnly, setNewOnly] = useState(false);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        setSubcategory(sub);
    }, [sub]);

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

    const categoryMeta = findCategory(category ?? undefined);
    const priceCeiling = useMemo(
        () => Math.max(...MOCK_PRODUCTS.map((p) => p.price)),
        [],
    );

    const products = useMemo(() => {
        let list: MockProduct[];

        if (filter === 'new') {
            list = getNewArrivals();
        } else if (category) {
            list = getProductsByCategory(category);
        } else {
            list = MOCK_PRODUCTS;
        }

        if (q?.trim()) {
            const term = q.trim().toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    p.category.toLowerCase().includes(term),
            );
        }

        if (subcategory) {
            list = list.filter((p) => p.subcategorySlug === subcategory);
        }

        if (newOnly) {
            list = list.filter((p) => p.isNew);
        }

        if (maxPrice !== null) {
            list = list.filter((p) => p.price <= maxPrice);
        }

        return sortProducts(list, sort);
    }, [category, filter, sort, subcategory, q, newOnly, maxPrice]);

    const pageTitle = q?.trim()
        ? `Search: ${q}`
        : filter === 'new'
          ? 'New Arrivals'
          : categoryMeta?.label ?? 'All Products';

    const pageDescription =
        filter === 'new'
            ? 'The latest additions to our curated collection.'
            : categoryMeta?.description ??
              'Browse our full preview catalogue of luxury home decor.';

    const activeFilterCount =
        (newOnly ? 1 : 0) + (maxPrice !== null ? 1 : 0) + (subcategory ? 1 : 0);

    const clearRefineFilters = () => {
        setNewOnly(false);
        setMaxPrice(null);
    };

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
                            color: category || filter ? '#999' : '#060606',
                            textDecoration: 'none',
                        }}
                    >
                        Shop
                    </Link>
                    {(category || filter === 'new') && (
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
                            <span style={{ color: '#999' }}>
                                ({products.length} products)
                            </span>
                        </p>
                    </div>
                    <div className="catalog-toolbar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
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
                </div>

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
                            <FilterChip active={!category && !filter} href="/shop">
                                All
                            </FilterChip>
                            <FilterChip active={filter === 'new'} href="/shop/new-arrivals">
                                New
                            </FilterChip>
                            {CATEGORIES.map((cat) => (
                                <FilterChip
                                    key={cat.slug}
                                    active={category === cat.slug}
                                    href={`/shop/${cat.slug}`}
                                >
                                    {cat.label}
                                </FilterChip>
                            ))}
                        </div>

                        {categoryMeta?.children && (
                            <div
                                className="catalog-chip-row catalog-type-row"
                                aria-label="Product type"
                            >
                                <FilterChip
                                    active={!subcategory}
                                    onClick={() => setSubcategory(null)}
                                >
                                    All {categoryMeta.label}
                                </FilterChip>
                                {categoryMeta.children.map((child) => (
                                    <FilterChip
                                        key={child.slug}
                                        active={subcategory === child.slug}
                                        onClick={() => setSubcategory(child.slug)}
                                    >
                                        {child.label}
                                    </FilterChip>
                                ))}
                            </div>
                        )}

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
                                    onClick={() => {
                                        clearRefineFilters();
                                        setSubcategory(null);
                                    }}
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
                                        color: !category && !filter ? '#060606' : '#6b6b6b',
                                        fontWeight: !category && !filter ? 500 : 300,
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
                                        color: filter === 'new' ? '#060606' : '#6b6b6b',
                                        fontWeight: filter === 'new' ? 500 : 300,
                                    }}
                                >
                                    New arrivals
                                </Link>
                            </li>
                            {CATEGORIES.map((cat) => (
                                <li key={cat.slug} style={{ marginBottom: '8px' }}>
                                    <Link
                                        href={`/shop/${cat.slug}`}
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            color:
                                                category === cat.slug
                                                    ? '#060606'
                                                    : '#6b6b6b',
                                            fontWeight:
                                                category === cat.slug ? 500 : 300,
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
                                newOnly={newOnly}
                                setNewOnly={setNewOnly}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                priceCeiling={priceCeiling}
                            />
                        </div>
                        {categoryMeta?.children && (
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
                                        <button
                                            type="button"
                                            onClick={() => setSubcategory(null)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '11px',
                                                color: !subcategory ? '#060606' : '#999',
                                                padding: 0,
                                            }}
                                        >
                                            All {categoryMeta.label}
                                        </button>
                                    </li>
                                    {categoryMeta.children.map((child) => (
                                        <li key={child.slug} style={{ marginBottom: '6px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setSubcategory(child.slug)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    color:
                                                        subcategory === child.slug
                                                            ? '#060606'
                                                            : '#999',
                                                    padding: 0,
                                                }}
                                            >
                                                {child.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </aside>

                    {products.length === 0 ? (
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                color: '#6b6b6b',
                            }}
                        >
                            No products in this category yet.
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
                            {products.map((product, idx) => (
                                <ProductCard key={product.id} product={product} index={idx} />
                            ))}
                        </div>
                    )}
                </div>
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
                            newOnly={newOnly}
                            setNewOnly={setNewOnly}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            priceCeiling={priceCeiling}
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
                            onClick={() => setFiltersOpen(false)}
                        >
                            Show {products.length} results
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
