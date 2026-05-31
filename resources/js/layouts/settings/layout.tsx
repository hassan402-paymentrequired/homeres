import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
// import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    // {
    //     title: 'Security',
    //     href: editSecurity(),
    //     icon: null,
    // },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <StorefrontShell>
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '48px 24px 80px',
                }}
            >
                <div style={{ marginBottom: '40px' }}>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            fontWeight: 400,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: '#999',
                            margin: '0 0 12px',
                        }}
                    >
                        Account
                    </p>
                    <h1
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '28px',
                            fontWeight: 500,
                            color: '#060606',
                            margin: '0 0 8px',
                            letterSpacing: '0.02em',
                        }}
                    >
                        Settings
                    </h1>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: '#6b6b6b',
                            margin: 0,
                        }}
                    >
                        Manage your profile and account settings
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                    }}
                    className="settings-layout"
                >
                    <nav
                        aria-label="Settings"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            borderBottom: '1px solid #e8e8e1',
                            paddingBottom: '16px',
                        }}
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentOrParentUrl(item.href);

                            return (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '11px',
                                        fontWeight: active ? 500 : 300,
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        color: active ? '#060606' : '#6b6b6b',
                                        textDecoration: 'none',
                                        padding: '8px 0',
                                        marginRight: '24px',
                                        borderBottom: active
                                            ? '1px solid #060606'
                                            : '1px solid transparent',
                                    }}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <section style={{ width: '100%', maxWidth: '480px' }}>{children}</section>
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .settings-layout {
                        flex-direction: row !important;
                        align-items: flex-start;
                    }
                    .settings-layout nav {
                        flex-direction: column !important;
                        flex-wrap: nowrap !important;
                        width: 180px;
                        flex-shrink: 0;
                        border-bottom: none !important;
                        border-right: 1px solid #e8e8e1;
                        padding-bottom: 0 !important;
                        padding-right: 24px;
                    }
                    .settings-layout nav a {
                        margin-right: 0 !important;
                    }
                }
            `}</style>
        </StorefrontShell>
    );
}
