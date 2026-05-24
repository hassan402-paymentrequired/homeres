import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/storefront/product-card';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { useWishlist } from '@/context/WishlistContext';
import type { StorefrontProduct } from '@/types/storefront-product';

function getCsrfToken(): string {
    return (
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

export default function WishlistPage() {
    const { ids } = useWishlist();
    const [products, setProducts] = useState<StorefrontProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ids.length === 0) {
            setProducts([]);

            return;
        }

        setLoading(true);

        fetch('/storefront/products/lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ ids }),
        })
            .then((response) => response.json())
            .then((data: { products: StorefrontProduct[] }) => {
                setProducts(data.products ?? []);
            })
            .finally(() => setLoading(false));
    }, [ids]);

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
                {loading ? (
                    <p style={{ color: '#6b6b6b' }}>Loading saved items…</p>
                ) : products.length === 0 ? (
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
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </StorefrontShell>
    );
}
