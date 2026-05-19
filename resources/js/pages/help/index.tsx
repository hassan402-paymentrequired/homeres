import { Head, Link } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { HELP_NAV } from '@/data/content/help-pages';

export default function HelpIndex() {
    return (
        <StorefrontShell>
            <Head title="Help Centre" />
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 30px' }}>
                <h1
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: '28px',
                        textTransform: 'uppercase',
                        margin: '0 0 12px',
                    }}
                >
                    Help Centre
                </h1>
                <p
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#6b6b6b',
                        margin: '0 0 32px',
                        lineHeight: 1.7,
                    }}
                >
                    Policies and answers for Homère Nigeria Limited. This preview uses
                    sample policy text for client approval.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {HELP_NAV.map((item) => (
                        <li
                            key={item.slug}
                            style={{ borderBottom: '1px solid #e8e8e1' }}
                        >
                            <Link
                                href={`/help/${item.slug}`}
                                style={{
                                    display: 'block',
                                    padding: '16px 0',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    color: '#060606',
                                    textDecoration: 'none',
                                }}
                            >
                                {item.label} →
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </StorefrontShell>
    );
}
