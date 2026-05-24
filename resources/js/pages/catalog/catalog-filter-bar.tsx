import { Link, router } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import {
    buildCatalogUrl,
    type CatalogFilters,
    type SortOption,
} from '@/pages/catalog/catalog-query';

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

type CatalogView = 'shop' | 'category' | 'collection' | 'brand' | 'brands' | 'new';

const selectStyle: CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    padding: '10px 12px',
    border: '1px solid #e8e8e1',
    background: '#fff',
    color: '#060606',
    minWidth: 0,
    flex: '1 1 140px',
    maxWidth: '100%',
};

const iconButtonStyle = (active: boolean): CSSProperties => ({
    padding: '10px 12px',
    border: '1px solid #e8e8e1',
    background: active ? '#060606' : '#fff',
    color: active ? '#fff' : '#060606',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
});

function GridIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    );
}

type Props = {
    view: CatalogView;
    basePath: string;
    filters: CatalogFilters;
    sidebarCategories: SidebarCategory[];
    categoryContext: CategoryContext | null;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    activeFilterCount: number;
    onOpenRefine: () => void;
};

export default function CatalogFilterBar({
    view,
    basePath,
    filters,
    sidebarCategories,
    categoryContext,
    viewMode,
    onViewModeChange,
    activeFilterCount,
    onOpenRefine,
}: Props) {
    const isBrandPage = view === 'brand';
    const isCategoryPage = view === 'category' || view === 'collection';
    const isNewPage = filters.filter === 'new';

    const visit = (overrides: Partial<CatalogFilters> = {}) => {
        router.get(buildCatalogUrl(basePath, filters, overrides), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const departmentValue = isBrandPage
        ? filters.category ?? ''
        : isCategoryPage
          ? filters.category ?? ''
          : '';

    const handleDepartmentChange = (value: string) => {
        if (isBrandPage) {
            visit({ category: value || null, sub: null });

            return;
        }

        if (value === '') {
            router.get('/shop', {}, { preserveState: true, preserveScroll: true });

            return;
        }

        router.get(`/shop/${value}`, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <div
            className="catalog-filter-bar"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '24px',
                width: '100%',
            }}
        >
            {!isNewPage && (
                <select
                    aria-label="Department"
                    value={departmentValue}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">
                        {isBrandPage ? 'All categories' : 'All departments'}
                    </option>
                    {sidebarCategories.map((cat) => (
                        <option key={cat.handle} value={cat.handle}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            )}

            {categoryContext && categoryContext.children.length > 0 && (
                <select
                    aria-label="Product type"
                    value={filters.sub ?? ''}
                    onChange={(e) =>
                        visit({ sub: e.target.value || null })
                    }
                    style={selectStyle}
                >
                    <option value="">All {categoryContext.label}</option>
                    {categoryContext.children.map((child) => (
                        <option key={child.handle} value={child.handle}>
                            {child.label}
                        </option>
                    ))}
                </select>
            )}

            <select
                aria-label="Sort products"
                value={filters.sort}
                onChange={(e) =>
                    visit({ sort: e.target.value as SortOption })
                }
                style={{ ...selectStyle, flex: '0 1 160px' }}
            >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
            </select>

            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                    onClick={() => onViewModeChange('grid')}
                    style={iconButtonStyle(viewMode === 'grid')}
                >
                    <GridIcon />
                </button>
                <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                    onClick={() => onViewModeChange('list')}
                    style={iconButtonStyle(viewMode === 'list')}
                >
                    <ListIcon />
                </button>
            </div>

            <button
                type="button"
                className="catalog-filters-trigger"
                onClick={onOpenRefine}
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: '10px 14px',
                    border: '1px solid #e8e8e1',
                    background: '#fff',
                    color: '#060606',
                    cursor: 'pointer',
                    flexShrink: 0,
                }}
            >
                Refine{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>

            {activeFilterCount > 0 && (
                <button
                    type="button"
                    onClick={() => visit({ new_only: false, max_price: null, sub: null })}
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'none',
                        color: '#6b6b6b',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        flexShrink: 0,
                    }}
                >
                    Clear
                </button>
            )}

            {isNewPage && (
                <Link
                    href="/shop"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        color: '#6b6b6b',
                        alignSelf: 'center',
                    }}
                >
                    View all shop
                </Link>
            )}
        </div>
    );
}
