/* eslint-disable @stylistic/padding-line-between-statements */
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from '@inertiajs/react';
import { login } from '@/routes';

interface NavItem {
    label: string;
    href: string;
    hasDropdown?: boolean;
    children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
    { label: 'New Arrivals', href: '#new-arrivals' },
    {
        label: 'Furniture',
        href: '#furniture',
        hasDropdown: true,
        children: [
            { label: 'Sofas & Armchairs', href: '#sofas' },
            { label: 'Tables & Desks', href: '#tables' },
            { label: 'Storage', href: '#storage' },
            { label: 'Beds & Bedroom', href: '#beds' },
        ],
    },
    {
        label: 'Lighting',
        href: '#lighting',
        hasDropdown: true,
        children: [
            { label: 'Pendant Lights', href: '#pendant' },
            { label: 'Floor Lamps', href: '#floor-lamps' },
            { label: 'Table Lamps', href: '#table-lamps' },
            { label: 'Wall Lights', href: '#wall-lights' },
        ],
    },
    {
        label: 'Home Accessories',
        href: '#home-accessories',
        hasDropdown: true,
        children: [
            { label: 'Decorative Objects', href: '#objects' },
            { label: 'Vases & Vessels', href: '#vases' },
            { label: 'Mirrors', href: '#mirrors' },
            { label: 'Trays & Bowls', href: '#trays' },
        ],
    },
    {
        label: 'Candles & Fragrance',
        href: '#candles',
        hasDropdown: true,
        children: [
            { label: 'Scented Candles', href: '#scented' },
            { label: 'Diffusers', href: '#diffusers' },
            { label: 'Room Sprays', href: '#sprays' },
        ],
    },
    {
        label: 'Coffee Table Books',
        href: '#books',
        hasDropdown: true,
        children: [
            { label: 'Architecture', href: '#architecture' },
            { label: 'Art & Design', href: '#art' },
            { label: 'Fashion', href: '#fashion' },
        ],
    },
    {
        label: 'Textiles',
        href: '#textiles',
        hasDropdown: true,
        children: [
            { label: 'Cushions', href: '#cushions' },
            { label: 'Throws', href: '#throws' },
            { label: 'Rugs', href: '#rugs' },
        ],
    },
    { label: 'Design Studio', href: '#studio' },
    { label: 'About Us', href: '#about' },
];

// Breakpoint for mobile (matches CSS media query below)
const MOBILE_BREAKPOINT = 768;

export default function SiteHeader() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { openCart, totalItems } = useCart();

    // Track scroll position to hide/show the nav bar
    useEffect(() => {
        const updateScrolled = () => setIsScrolled(window.scrollY > 0);
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolled);
    }, []);

    // Track viewport width for responsive behaviour
    useEffect(() => {
        const updateMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        updateMobile();
        window.addEventListener('resize', updateMobile);
        return () => window.removeEventListener('resize', updateMobile);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        if (!isMobile) setMobileOpen(false);
    }, [isMobile]);

    const toggleMobileItem = (label: string) => {
        setMobileExpandedItem((prev) => (prev === label ? null : label));
    };

    return (
        <>
            <style>{`
                .site-header-search:focus {
                    outline: 1px solid #060606 !important;
                }
                .site-header-nav-link:hover {
                    color: #6b6b6b !important;
                }
                .site-header-dropdown-item:hover {
                    background: #f5f5f3 !important;
                }
                @media (max-width: 767px) {
                    .header-search-wrap { display: none !important; }
                    .header-account-label { display: none !important; }
                    .header-cart-label { display: none !important; }
                    .header-mobile-btn { display: flex !important; }
                    .desktop-nav { display: none !important; }
                }
                @media (min-width: 768px) {
                    .header-mobile-btn { display: none !important; }
                    .mobile-nav { display: none !important; }
                }
            `}</style>

            {/* Announcement bar */}
            <div
                style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #e8e8e1',
                    textAlign: 'center',
                    padding: '8px 30px',
                }}
            >
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: '1.5px',
                        color: '#060606',
                        margin: 0,
                    }}
                >
                    🚀 new campaign goes here
                </p>
            </div>

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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '64px',
                        gap: '16px',
                    }}
                >
                    {/* Logo — on mobile when scrolled, show hamburger inline with logo */}
                    <a
                        href="#"
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '22px',
                            fontWeight: 500,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#060606',
                            textDecoration: 'none',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        {/* On mobile, always show hamburger icon to the left of the logo */}
                        <button
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
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
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
                        HEMERE
                    </a>

                    {/* Search bar — hidden on mobile */}
                    <div
                        className="header-search-wrap"
                        style={{
                            flex: '1',
                            maxWidth: '420px',
                            margin: '0 16px',
                            position: 'relative',
                        }}
                    >
                        <input
                            type="search"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="site-header-search"
                            style={{
                                width: '100%',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                fontWeight: 300,
                                letterSpacing: '1px',
                                color: '#060606',
                                background: '#f5f5f3',
                                border: '1px solid #e8e8e1',
                                borderRadius: 0,
                                padding: '9px 40px 9px 14px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <button
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#060606',
                            }}
                            aria-label="Search"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>

                    {/* Icons */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            flexShrink: 0,
                        }}
                    >
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
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span className="header-account-label">Account</span>
                        </Link>

                        <button
                            onClick={openCart}
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
                                position: 'relative',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                            aria-label="Open shopping bag"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {totalItems > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-8px',
                                        background: '#060606',
                                        color: '#ffffff',
                                        borderRadius: '50%',
                                        width: '16px',
                                        height: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '9px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {totalItems}
                                </span>
                            )}
                            <span className="header-cart-label">Cart</span>
                        </button>
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
                                <a
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
                                </a>

                                {/* Dropdown */}
                                {item.hasDropdown && item.children && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            background: '#ffffff',
                                            border: '1px solid #e8e8e1',
                                            minWidth: '200px',
                                            zIndex: 100,
                                            opacity: openDropdown === item.label ? 1 : 0,
                                            pointerEvents: openDropdown === item.label ? 'auto' : 'none',
                                            transform: openDropdown === item.label ? 'translateY(0)' : 'translateY(-6px)',
                                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                        }}
                                    >
                                        {item.children.map((child) => (
                                            <a
                                                key={child.label}
                                                href={child.href}
                                                className="site-header-dropdown-item"
                                                style={{
                                                    display: 'block',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    fontWeight: 300,
                                                    letterSpacing: '1.5px',
                                                    textTransform: 'uppercase',
                                                    color: '#060606',
                                                    textDecoration: 'none',
                                                    padding: '11px 20px',
                                                    borderBottom: '1px solid #f0f0ec',
                                                    transition: 'background 0.15s ease',
                                                    background: 'transparent',
                                                }}
                                            >
                                                {child.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                        {/* Mobile search bar */}
                        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0ec' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="search"
                                    placeholder="Search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="site-header-search"
                                    style={{
                                        width: '100%',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        letterSpacing: '1px',
                                        color: '#060606',
                                        background: '#f5f5f3',
                                        border: '1px solid #e8e8e1',
                                        borderRadius: 0,
                                        padding: '9px 40px 9px 14px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: '#060606',
                                    }}
                                    aria-label="Search"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            </div>
                        </div>

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
                                                borderBottom: '1px solid #f0f0ec',
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
                                                    <a
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
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <a
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
                                    </a>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
            </header>
        </>
    );
}