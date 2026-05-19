import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/storefront/product-card';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { MOCK_PRODUCTS } from '@/data/mock-products';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
    const { ids } = useWishlist();
    const products = MOCK_PRODUCTS.filter((p) => ids.includes(p.id));

    return (
        <StorefrontShell>
            <Head title="Wishlist" />
            <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '48px 30px' }}>
                <h1
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: '28px',
                        textTransform: 'uppercase',
                        margin: '0 0 8px',
                    }}
                >
                    Wishlist
                </h1>
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        color: '#6b6b6b',
                        margin: '0 0 32px',
                    }}
                >
                    Saved on this device.
                </p>
                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: '#6b6b6b', marginBottom: '16px' }}>
                            Your wishlist is empty.
                        </p>
                        <Link
                            href="/shop"
                            style={{
                                fontSize: '12px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#060606',
                            }}
                        >
                            Continue shopping
                        </Link>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '22px',
                        }}
                        className="wishlist-grid"
                    >
                        {products.map((p, idx) => (
                            <ProductCard key={p.id} product={p} index={idx} />
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
