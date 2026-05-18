import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
}

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

export default function CatalogPage({
    category = null,
    filter = null,
}: CatalogPageProps) {
    const [sort, setSort] = useState<SortOption>('featured');
    const [subcategory, setSubcategory] = useState<string | null>(null);

    const categoryMeta = findCategory(category ?? undefined);

    const products = useMemo(() => {
        let list: MockProduct[];

        if (filter === 'new') {
            list = getNewArrivals();
        } else if (category) {
            list = getProductsByCategory(category);
        } else {
            list = MOCK_PRODUCTS;
        }

        if (subcategory) {
            list = list.filter((p) => p.subcategorySlug === subcategory);
        }

        return sortProducts(list, sort);
    }, [category, filter, sort, subcategory]);

    const pageTitle =
        filter === 'new'
            ? 'New Arrivals'
            : categoryMeta?.label ?? 'All Products';

    const pageDescription =
        filter === 'new'
            ? 'The latest additions to our curated collection.'
            : categoryMeta?.description ??
              'Browse our full preview catalogue of luxury home decor.';

    return (
        <StorefrontShell>
            <Head title={pageTitle} />
            <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '48px 30px' }}>
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
                                ({products.length} sample products)
                            </span>
                        </p>
                    </div>
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
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '220px 1fr',
                        gap: '40px',
                    }}
                    className="catalog-layout"
                >
                    <aside>
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
                                    Filter
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
                            No sample products in this category yet.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '22px',
                            }}
                            className="catalog-grid"
                        >
                            {products.map((product, idx) => (
                                <ProductCard key={product.id} product={product} index={idx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .catalog-layout { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 1100px) {
                    .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
