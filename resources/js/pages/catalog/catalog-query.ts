export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

export type CatalogFilters = {
    category: string | null;
    brand: string | null;
    filter: string | null;
    q: string | null;
    sub: string | null;
    sort: SortOption;
    new_only: boolean;
    max_price: number | null;
};

export function buildCatalogUrl(
    basePath: string,
    filters: CatalogFilters,
    overrides: Partial<CatalogFilters> = {},
): string {
    const merged = { ...filters, ...overrides };
    const params = new URLSearchParams();

    if (merged.q) {
        params.set('q', merged.q);
    }

    if (merged.sub) {
        params.set('sub', merged.sub);
    }

    if (merged.sort && merged.sort !== 'featured') {
        params.set('sort', merged.sort);
    }

    if (merged.new_only) {
        params.set('new_only', '1');
    }

    if (merged.max_price !== null && merged.max_price > 0) {
        params.set('max_price', String(merged.max_price));
    }

    const query = params.toString();

    return query ? `${basePath}?${query}` : basePath;
}
