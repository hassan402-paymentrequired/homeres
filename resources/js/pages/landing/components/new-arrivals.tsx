import { Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import ProductCard from '@/components/storefront/product-card';
import type { StorefrontProduct } from '@/types/storefront-product';

export default function NewArrivals({
    products,
}: {
    products: StorefrontProduct[];
}) {
    const newArrivals = products;
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="new-arrivals"
            ref={ref}
            style={{
                padding: '48px 30px',
                maxWidth: '1500px',
                margin: '0 auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                }}
            >
                <h2
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: 'calc(29px * 0.63)',
                        fontWeight: 500,
                        letterSpacing: '0.025em',
                        textTransform: 'uppercase',
                        color: '#060606',
                        lineHeight: 1.1,
                        margin: 0,
                    }}
                >
                    New Arrivals
                </h2>
                <Link
                    href="/shop/new-arrivals"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '11px',
                        fontWeight: 300,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#060606',
                        textDecoration: 'none',
                        borderBottom: '1px solid #060606',
                        paddingBottom: '1px',
                    }}
                >
                    View all
                </Link>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '22px',
                }}
                className="products-grid"
            >
                {newArrivals.map((product, idx) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        index={idx}
                        animate
                        visible={visible}
                    />
                ))}
            </div>
            <style>{`
                @media (max-width: 1200px) {
                    .products-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
                @media (max-width: 900px) {
                    .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </section>
    );
}
