import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/storefront/product-card';
import StorefrontPagination from '@/components/storefront/storefront-pagination';
import StorefrontShell from '@/components/storefront/storefront-shell';
import CatalogFilterBar from '@/pages/catalog/catalog-filter-bar';
import {
    buildCatalogUrl,
    type CatalogFilters,
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

type BrandContext = {
    handle: string;
    name: string;
};

type CatalogMeta = {
    view: CatalogView;
    title: string;
    description: string | null;
    basePath: string;
    filters: CatalogFilters;
    sidebarCategories: SidebarCategory[];
    categoryContext: CategoryContext | null;
    brandContext?: BrandContext | null;
    brands?: BrandDirectoryEntry[];
};

interface CatalogPageProps {
    products: Paginated<StorefrontProduct>;
    catalog: CatalogMeta;
}

type ViewMode = 'grid' | 'list';

const PRICE_CEILING = 5_000_000;

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
        (filters.sub ? 1 : 0) +
        (view === 'brand' && filters.category ? 1 : 0);

    const clearRefineFilters = () => {
        visitCatalog({
            new_only: false,
            max_price: null,
            sub: null,
            category: view === 'brand' ? null : filters.category,
        });
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
                </div>

                {isBrandDirectory && catalog.brands ? (
                    <BrandsDirectory brands={catalog.brands} />
                ) : (
                    <>
                        <CatalogFilterBar
                            view={view}
                            basePath={basePath}
                            filters={filters}
                            sidebarCategories={sidebarCategories}
                            categoryContext={categoryContext}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            activeFilterCount={activeFilterCount}
                            onOpenRefine={() => setFiltersOpen(true)}
                        />

                        <div className="catalog-products">
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
                    </>
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
                                    category:
                                        view === 'brand' ? filters.category : undefined,
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
                .catalog-products {
                    min-width: 0;
                    width: 100%;
                }
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
                    .catalog-filter-bar .storefront-select {
                        flex: 1 1 100% !important;
                        max-width: 100% !important;
                    }
                    .catalog-grid,
                    .catalog-list {
                        min-width: 0;
                        width: 100%;
                    }
                    .catalog-page { padding: 32px 20px !important; }
                    .catalog-header { flex-direction: column !important; align-items: stretch !important; }
                    .catalog-header h1 { font-size: calc(29px * 0.7) !important; }
                }
                @media (max-width: 640px) {
                    .catalog-page { padding: 24px 16px !important; }
                    .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
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
