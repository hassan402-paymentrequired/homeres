import { Link } from '@inertiajs/react';
import {
    collectionHref,
    navLinkHref,
    type StorefrontNavItem,
} from '@/data/storefront-navigation';

interface MegaMenuProps {
    item: StorefrontNavItem;
    isOpen: boolean;
}

const columnHeadingStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: '"Proza Libre", sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#060606',
    textDecoration: 'none',
    margin: '0 0 12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e8e8e1',
};

const linkStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 300,
    letterSpacing: '0.5px',
    color: '#6b6b6b',
    textDecoration: 'none',
    padding: '5px 0',
    lineHeight: 1.4,
    transition: 'color 0.15s ease',
};

function NavColumnLinks({
    links,
    title,
    titleHandle,
}: {
    links: { label: string; handle: string }[];
    title?: string;
    titleHandle?: string;
}) {
    return (
        <div>
            {title && (
                titleHandle ? (
                    <Link
                        href={collectionHref(titleHandle)}
                        style={columnHeadingStyle}
                        className="mega-menu-heading"
                    >
                        {title}
                    </Link>
                ) : (
                    <p style={{ ...columnHeadingStyle, borderBottom: 'none', marginBottom: '8px' }}>
                        {title}
                    </p>
                )
            )}
            {links.map((entry) => (
                <Link
                    key={`${entry.handle}-${entry.label}`}
                    href={navLinkHref(entry)}
                    style={linkStyle}
                    className="mega-menu-link"
                >
                    {entry.label}
                </Link>
            ))}
        </div>
    );
}

export default function MegaMenu({ item, isOpen }: MegaMenuProps) {
    if (!isOpen) {
        return null;
    }

    const viewAllHref = item.href ?? (item.handle ? collectionHref(item.handle) : undefined);

    return (
        <>
            <style>{`
                .mega-menu-link:hover { color: #060606 !important; }
                .mega-menu-heading:hover { color: #6b6b6b !important; }
            `}</style>
            <div
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw',
                    background: '#ffffff',
                    borderTop: '1px solid #e8e8e1',
                    borderBottom: '1px solid #e8e8e1',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        maxWidth: '1500px',
                        margin: '0 auto',
                        padding: '32px 20px 36px',
                    }}
                >
                    {item.columns && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${Math.min(item.columns.length, 7)}, minmax(0, 1fr))`,
                                gap: '28px 36px',
                            }}
                        >
                            {item.columns.map((column, index) => (
                                <NavColumnLinks
                                    key={column.title ?? `col-${index}`}
                                    title={column.title}
                                    titleHandle={column.titleHandle}
                                    links={column.links}
                                />
                            ))}
                        </div>
                    )}

                    {item.links && !item.columns && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '8px 32px',
                                maxWidth: '640px',
                            }}
                        >
                            {item.links.map((entry) => (
                                <Link
                                    key={entry.handle}
                                    href={navLinkHref(entry)}
                                    style={linkStyle}
                                    className="mega-menu-link"
                                >
                                    {entry.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {viewAllHref && (
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0ec' }}>
                            <Link
                                href={viewAllHref}
                                style={{
                                    ...linkStyle,
                                    display: 'inline-block',
                                    color: '#060606',
                                    fontWeight: 500,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    borderBottom: '1px solid #060606',
                                    paddingBottom: '2px',
                                }}
                            >
                                Browse all {item.label.toLowerCase()}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
