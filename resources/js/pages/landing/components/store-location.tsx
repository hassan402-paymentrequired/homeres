/* eslint-disable curly */
import { Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { BRAND } from '@/data/brand';

const stores = [
    {
        id: 1,
        type: 'Flagship Store',
        name: 'Homère Victoria Island',
        city: 'Lagos',
        address: BRAND.address,
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
        alt: 'Homère flagship boutique interior in Victoria Island, Lagos',
    },
];

export default function StoreLocations() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
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
            id="stores"
            ref={ref}
            style={{ padding: '48px 30px', maxWidth: '1500px', margin: '0 auto' }}
        >
            <h2
                style={{
                    fontFamily: '"Proza Libre", sans-serif',
                    fontSize: 'calc(29px * 0.63)',
                    fontWeight: 500,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                    color: '#060606',
                    margin: '0 0 28px',
                    textAlign: 'center',
                }}
            >
                Visit Us
            </h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '22px',
                    maxWidth: '720px',
                    margin: '0 auto',
                }}
            >
                {stores.map((store, idx) => (
                    <Link
                        key={store.id}
                        href="/contact"
                        style={{
                            textDecoration: 'none',
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 0,
                                background: '#f5f5f3',
                            }}
                            className="store-card"
                        >
                            <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                                <img
                                    src={store.image}
                                    alt={store.alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#6b6b6b',
                                        margin: '0 0 8px',
                                    }}
                                >
                                    {store.type}
                                </p>
                                <h3
                                    style={{
                                        fontFamily: '"Proza Libre", sans-serif',
                                        fontSize: '18px',
                                        fontWeight: 500,
                                        color: '#060606',
                                        margin: '0 0 12px',
                                    }}
                                >
                                    {store.name}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: '#6b6b6b',
                                        margin: 0,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {store.address}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <style>{`
                @media (max-width: 640px) {
                    .store-card { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
