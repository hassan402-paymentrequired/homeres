import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { login, logout } from '@/routes';
import { index as ordersIndex } from '@/routes/account/orders';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

const accountLinkStyle: React.CSSProperties = {
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
};

const userIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

function firstName(name: string): string {
    return name.trim().split(/\s+/)[0] ?? name;
}

type Props = {
    variant?: 'header' | 'mobile';
    onNavigate?: () => void;
};

export default function StorefrontAccountMenu({
    variant = 'header',
    onNavigate,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const close = () => {
        setOpen(false);
        onNavigate?.();
    };

    const handleLogout = () => {
        close();
        router.flushAll();
    };

    if (!user) {
        if (variant === 'mobile') {
            return (
                <Link href={login().url} onClick={onNavigate} style={mobileLinkStyle}>
                    Sign in
                </Link>
            );
        }

        return (
            <Link href={login().url} style={accountLinkStyle}>
                {userIcon}
                <span className="header-account-label">Account</span>
            </Link>
        );
    }

    if (variant === 'mobile') {
        return (
            <div>
                <p style={mobileGroupHeadingStyle}>Account</p>
                <p
                    style={{
                        ...mobileChildStyle,
                        color: '#6b6b6b',
                        textTransform: 'none',
                        letterSpacing: '0.3px',
                        fontSize: '12px',
                    }}
                >
                    {user.name}
                </p>
                <Link href={edit().url} onClick={onNavigate} style={mobileChildStyle}>
                    Settings
                </Link>
                <Link
                    href={ordersIndex().url}
                    onClick={onNavigate}
                    style={mobileChildStyle}
                >
                    Order history
                </Link>
                <Link
                    href={logout().url}
                    method="post"
                    as="button"
                    onClick={handleLogout}
                    style={{
                        ...mobileChildStyle,
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >
                    Sign out
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                style={{
                    ...accountLinkStyle,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                {userIcon}
                <span className="header-account-label">{firstName(user.name)}</span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <polyline points="2,3 5,7 8,3" />
                </svg>
            </button>

            {open && (
                <div
                    role="menu"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        minWidth: '220px',
                        background: '#ffffff',
                        border: '1px solid #e8e8e1',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        zIndex: 60,
                    }}
                >
                    <div
                        style={{
                            padding: '16px 18px',
                            borderBottom: '1px solid #f0f0ec',
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#060606',
                            }}
                        >
                            {user.name}
                        </p>
                        <p
                            style={{
                                margin: '4px 0 0',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                            }}
                        >
                            {user.email}
                        </p>
                    </div>

                    <Link
                        href={edit().url}
                        role="menuitem"
                        onClick={close}
                        style={dropdownItemStyle}
                    >
                        Settings
                    </Link>
                    <Link
                        href={ordersIndex().url}
                        role="menuitem"
                        onClick={close}
                        style={dropdownItemStyle}
                    >
                        Order history
                    </Link>
                    <div style={{ borderTop: '1px solid #f0f0ec' }}>
                        <Link
                            href={logout().url}
                            method="post"
                            as="button"
                            role="menuitem"
                            onClick={handleLogout}
                            style={{
                                ...dropdownItemStyle,
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

const dropdownItemStyle: React.CSSProperties = {
    display: 'block',
    padding: '12px 18px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#060606',
    textDecoration: 'none',
};

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
