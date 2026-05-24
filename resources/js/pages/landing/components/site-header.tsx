/* eslint-disable @stylistic/padding-line-between-statements */
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MegaMenu from '@/components/storefront/mega-menu';
import PreviewBanner from '@/components/storefront/preview-banner';
import SearchOverlay from '@/components/storefront/search-overlay';
import StorefrontCurrencySelect from '@/components/storefront/storefront-currency-select';
import { useCart } from '@/context/CartContext';
import {
    hasDropdown,
    navItemHref,
    navLinkHref,
    useStorefrontNav,
    type StorefrontNavItem,
} from '@/data/navigation';
import { home, login } from '@/routes';

const MOBILE_BREAKPOINT = 768;

function MobileNavSection({
    item,
    onNavigate,
}: {
    item: StorefrontNavItem;
    onNavigate: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const dropdown = hasDropdown(item);

    if (!dropdown) {
        return (
            <Link
                href={navItemHref(item)}
                onClick={onNavigate}
                style={mobileLinkStyle}
            >
                {item.label}
            </Link>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                style={mobileToggleStyle}
            >
                {item.label}
                <Chevron expanded={expanded} />
            </button>
            {expanded && (
                <div style={{ background: '#f9f9f7' }}>
                    {item.columns?.map((column) => (
                        <div key={column.title ?? column.links[0]?.handle}>
                            {column.title && (
                                <p style={mobileGroupHeadingStyle}>{column.title}</p>
                            )}
                            {column.links.map((entry) => (
                                <Link
                                    key={`${entry.handle}-${entry.label}`}
                                    href={navLinkHref(entry, item)}
                                    onClick={onNavigate}
                                    style={mobileChildStyle}
                                >
                                    {entry.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    {item.brandGroups?.map((group) => (
                        <div key={group.title}>
                            <p style={mobileGroupHeadingStyle}>{group.title}</p>
                            {group.links.map((entry) => (
                                <Link
                                    key={entry.handle}
                                    href={navLinkHref(entry, item)}
                                    onClick={onNavigate}
                                    style={mobileChildStyle}
                                >
                                    {entry.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    {item.links && !item.columns && !item.brandGroups &&
                        item.links.map((entry) => (
                            <Link
                                key={entry.handle}
                                href={navLinkHref(entry, item)}
                                onClick={onNavigate}
                                style={mobileChildStyle}
                            >
                                {entry.label}
                            </Link>
                        ))}

                    {item.handle && !item.brandGroups && (
                        <Link
                            href={navItemHref(item)}
                            onClick={onNavigate}
                            style={{ ...mobileChildStyle, fontWeight: 500, color: '#060606' }}
                        >
                            Browse all {item.label.toLowerCase()}
                        </Link>
                    )}

                    {item.brandGroups && (
                        <Link
                            href="/brands"
                            onClick={onNavigate}
                            style={{ ...mobileChildStyle, fontWeight: 500, color: '#060606' }}
                        >
                            View all Brands
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

function Chevron({ expanded }: { expanded: boolean }) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
            }}
        >
            <polyline points="2,3 5,7 8,3" />
        </svg>
    );
}

const mobileLinkStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 300,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#060606',
    textDecoration: 'none',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0ec',
};

const mobileToggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#060606',
    padding: '14px 20px',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #f0f0ec',
    cursor: 'pointer',
    textAlign: 'left',
};

const mobileChildStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 300,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#444',
    textDecoration: 'none',
    padding: '11px 32px',
    borderBottom: '1px solid #ebebeb',
};

const mobileGroupHeadingStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#060606',
    margin: 0,
    padding: '12px 32px 6px',
};

export default function SiteHeader() {
    const navItems = useStorefrontNav();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopNavOpen, setDesktopNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { openCart, totalItems } = useCart();

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => setSearchOpen(false);

    const activeDropdownItem = navItems.find((item) => item.label === openDropdown);
    const showDesktopNav = !isScrolled || desktopNavOpen;

    useEffect(() => {
        const updateScrolled = () => setIsScrolled(window.scrollY > 0);
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolled);
    }, []);

    useEffect(() => {
        if (!isScrolled) {
            setDesktopNavOpen(false);
            setOpenDropdown(null);
        }
    }, [isScrolled]);

    useEffect(() => {
        const updateMobile = () => {
            if (window.innerWidth >= MOBILE_BREAKPOINT) {
                setMobileOpen(false);
            } else {
                setDesktopNavOpen(false);
            }
        };

        updateMobile();
        window.addEventListener('resize', updateMobile);
        return () => window.removeEventListener('resize', updateMobile);
    }, []);

    const toggleDesktopNav = () => {
        setDesktopNavOpen((open) => {
            if (open) {
                setOpenDropdown(null);
            }

            return !open;
        });
    };

    const searchIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );

    return (
        <>
            <style>{`
                .site-header-nav-link:hover {
                    color: #6b6b6b !important;
                }
                .header-row {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    width: 100%;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    justify-self: start;
                    min-width: 0;
                }
                .header-center {
                    justify-self: center;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    justify-self: end;
                    flex-shrink: 0;
                }
                .header-icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: #060606;
                }
                .desktop-nav-row {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                @media (max-width: 767px) {
                    .header-currency-select { display: none !important; }
                    .header-account-label { display: none !important; }
                    .header-cart-label { display: none !important; }
                    .header-wishlist-label { display: none !important; }
                    .header-mobile-btn { display: flex !important; }
                    .desktop-nav { display: none !important; }
                    .header-right { gap: 16px; }
                }
                @media (min-width: 768px) {
                    .header-mobile-btn { display: none !important; }
                    .mobile-nav { display: none !important; }
                    .header-desktop-menu-btn { display: flex !important; }
                }
                .header-desktop-menu-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: #060606;
                }
                .header-desktop-menu-btn.is-hidden {
                    display: none !important;
                }
            `}</style>

            <PreviewBanner />

            <header
                style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #e8e8e1',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        maxWidth: '1500px',
                        margin: '0 auto',
                        padding: '0 20px',
                        height: '64px',
                    }}
                >
                    <div className="header-row" style={{ height: '100%' }}>
                        <div className="header-left">
                            <button
                                type="button"
                                className="header-mobile-btn"
                                onClick={() => setMobileOpen((v) => !v)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: '#060606',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                aria-label="Toggle menu"
                                aria-expanded={mobileOpen}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    {mobileOpen ? (
                                        <>
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </>
                                    ) : (
                                        <>
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="18" x2="21" y2="18" />
                                        </>
                                    )}
                                </svg>
                            </button>
                            <button
                                type="button"
                                className={`header-desktop-menu-btn${isScrolled ? '' : ' is-hidden'}`}
                                onClick={toggleDesktopNav}
                                aria-label={desktopNavOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={desktopNavOpen}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    {desktopNavOpen ? (
                                        <>
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </>
                                    ) : (
                                        <>
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="18" x2="21" y2="18" />
                                        </>
                                    )}
                                </svg>
                            </button>
                            <Link
                                href="/wishlist"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 300,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    color: '#060606',
                                    textDecoration: 'none',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span className="header-wishlist-label">Wishlist</span>
                            </Link>
                        </div>
                        <div className="header-center">
                            <Link href={home().url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                <img src="/logo.png" alt="Homère logo" style={{ width: '88px', height: '44px', objectFit: 'contain', display: 'block' }} />
                            </Link>
                        </div>
                        <div className="header-right">
                            <span className="header-currency-select">
                                <StorefrontCurrencySelect />
                            </span>
                            <button type="button" className="header-icon-btn" onClick={openSearch} aria-label="Open search">
                                {searchIcon}
                            </button>
                            <Link
                                href={login().url}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 300,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    color: '#060606',
                                    textDecoration: 'none',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="header-account-label">Account</span>
                            </Link>
                            <button type="button" onClick={openCart} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 300, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#060606', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Open shopping bag">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {totalItems > 0 && (
                                    <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#060606', color: '#ffffff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 }}>
                                        {totalItems}
                                    </span>
                                )}
                                <span className="header-cart-label">Cart</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop navigation */}
                <nav
                    className="desktop-nav"
                    style={{
                        borderTop: '1px solid #e8e8e1',
                        background: '#ffffff',
                        display: showDesktopNav ? 'block' : 'none',
                        position: 'relative',
                    }}
                    onMouseLeave={() => setOpenDropdown(null)}
                >
                    <div
                        style={{
                            maxWidth: '1500px',
                            margin: '0 auto',
                            padding: '0 20px',
                        }}
                    >
                        <div className="desktop-nav-row">
                            {navItems.map((item) => (
                                <div
                                    key={item.label}
                                    onMouseEnter={() => hasDropdown(item) && setOpenDropdown(item.label)}
                                >
                                    <Link
                                        href={navItemHref(item)}
                                        className="site-header-nav-link"
                                        onClick={() => {
                                            if (isScrolled) {
                                                setDesktopNavOpen(false);
                                                setOpenDropdown(null);
                                            }
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 300,
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            color: '#060606',
                                            textDecoration: 'none',
                                            padding: '14px 12px',
                                            whiteSpace: 'nowrap',
                                            transition: 'color 0.2s ease',
                                        }}
                                    >
                                        {item.label}
                                        {hasDropdown(item) && (
                                            <Chevron expanded={openDropdown === item.label} />
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeDropdownItem && hasDropdown(activeDropdownItem) && (
                        <MegaMenu item={activeDropdownItem} isOpen />
                    )}
                </nav>

                {/* Mobile navigation */}
                {mobileOpen && (
                    <nav
                        className="mobile-nav"
                        style={{
                            background: '#ffffff',
                            borderTop: '1px solid #e8e8e1',
                            padding: '8px 0 16px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                    >
                        {navItems.map((item) => (
                            <MobileNavSection
                                key={item.label}
                                item={item}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        ))}
                    </nav>
                )}
            </header>

            <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
        </>
    );
}
