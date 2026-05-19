import { Link } from '@inertiajs/react';
import type { Category } from '@/data/categories';

interface MegaMenuProps {
    category: Category;
    isOpen: boolean;
}

const linkStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 300,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#6b6b6b',
    textDecoration: 'none',
    padding: '6px 0',
};

export default function MegaMenu({ category, isOpen }: MegaMenuProps) {
    if (!isOpen || !category.children?.length) {
        return null;
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#ffffff',
                border: '1px solid #e8e8e1',
                boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                zIndex: 100,
                minWidth: '520px',
                padding: '28px 32px',
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '32px',
                }}
            >
                <div>
                    <p
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '14px',
                            fontWeight: 500,
                            margin: '0 0 8px',
                            textTransform: 'uppercase',
                        }}
                    >
                        {category.label}
                    </p>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            fontWeight: 300,
                            color: '#6b6b6b',
                            margin: '0 0 16px',
                            lineHeight: 1.6,
                        }}
                    >
                        {category.description}
                    </p>
                    <Link
                        href={`/shop/${category.slug}`}
                        style={{
                            ...linkStyle,
                            color: '#060606',
                            fontWeight: 500,
                            borderBottom: '1px solid #060606',
                            display: 'inline-block',
                        }}
                    >
                        View all
                    </Link>
                </div>
                <div>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '10px',
                            fontWeight: 500,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            margin: '0 0 12px',
                            color: '#999',
                        }}
                    >
                        Shop by type
                    </p>
                    {category.children.map((child) => (
                        <Link
                            key={child.slug}
                            href={`/shop/${category.slug}?sub=${child.slug}`}
                            style={linkStyle}
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
