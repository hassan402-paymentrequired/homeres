/* eslint-disable @stylistic/padding-line-between-statements */
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MegaMenu from '@/components/storefront/mega-menu';
import PreviewBanner from '@/components/storefront/preview-banner';
import SearchOverlay from '@/components/storefront/search-overlay';
import { useCart } from '@/context/CartContext';
import { CATEGORIES } from '@/data/categories';
import { MAIN_NAV } from '@/data/navigation';
import { home, login } from '@/routes';

const navItems = MAIN_NAV;

// Breakpoint for mobile (matches CSS media query below)
const MOBILE_BREAKPOINT = 768;

export default function SiteHeader() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { openCart, totalItems } = useCart();

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => setSearchOpen(false);

    const searchIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );

    // Track scroll position to hide/show the nav bar
    useEffect(() => {
        const updateScrolled = () => setIsScrolled(window.scrollY > 0);
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolled);
    }, []);

    // Track viewport width for responsive behaviour
    useEffect(() => {
        const updateMobile = () => {
            const mobileViewport = window.innerWidth < MOBILE_BREAKPOINT;

            if (!mobileViewport) {
                setMobileOpen(false);
            }
        };

        updateMobile();
        window.addEventListener('resize', updateMobile);
        return () => window.removeEventListener('resize', updateMobile);
    }, []);

    const toggleMobileItem = (label: string) => {
        setMobileExpandedItem((prev) => (prev === label ? null : label));
    };

    return (
        <>
            <style>{`
                .site-header-nav-link:hover {
                    color: #6b6b6b !important;
                }
                .site-header-dropdown-item:hover {
                    background: #f5f5f3 !important;
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
                @media (max-width: 767px) {
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
                }
            `}</style>

            <PreviewBanner />

            {/* Main header */}
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

                {/* Desktop navigation — hidden when scrolled */}
                <nav
                    className="desktop-nav"
                    style={{
                        borderTop: '1px solid #e8e8e1',
                        background: '#ffffff',
                        display: isScrolled ? 'none' : 'flex',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1500px',
                            margin: '0 auto',
                            padding: '0 20px',
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                style={{ position: 'relative' }}
                                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className="site-header-nav-link"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#060606',
                                        textDecoration: 'none',
                                        padding: '14px 18px',
                                        whiteSpace: 'nowrap',
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {item.label}
                                    {item.hasDropdown && (
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            style={{
                                                transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                            }}
                                        >
                                            <polyline points="2,3 5,7 8,3" />
                                        </svg>
                                    )}
                                </Link>

                                {item.categorySlug && (
                                    <MegaMenu
                                        category={
                                            CATEGORIES.find(
                                                (c) => c.slug === item.categorySlug,
                                            )!
                                        }
                                        isOpen={openDropdown === item.label}
                                    />
                                )}                            </div>
                        ))}
                    </div>
                </nav>

                {/* Mobile nav — slide open/close */}
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
                            <div key={item.label}>
                                {item.hasDropdown ? (
                                    <>
                                        <button
                                            onClick={() => toggleMobileItem(item.label)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                fontWeight: 300,
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase',
                                                color: '#060606',
                                                textDecoration: 'none',
                                                padding: '14px 20px',
                                                background: 'none',
                                                border: 'none',
                                                borderBottom: '1px solid #f0f0ec',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {item.label}
                                            <svg
                                                width="10"
                                                height="10"
                                                viewBox="0 0 10 10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                style={{
                                                    transform: mobileExpandedItem === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <polyline points="2,3 5,7 8,3" />
                                            </svg>
                                        </button>
                                        {mobileExpandedItem === item.label && item.children && (
                                            <div style={{ background: '#f9f9f7' }}>
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        style={{
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
                                                        }}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
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
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
            </header>

            <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
        </>
    );
}
