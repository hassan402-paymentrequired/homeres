import { Head, Link } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import { HELP_NAV, HELP_PAGES } from '@/data/content/help-pages';

interface HelpShowProps {
    slug: string;
}

export default function HelpShow({ slug }: HelpShowProps) {
    const page = HELP_PAGES[slug];

    if (!page) {
        return (
            <StorefrontShell>
                <Head title="Help" />
                <div style={{ padding: '64px 30px', textAlign: 'center' }}>
                    <p>Page not found.</p>
                    <Link href="/help">Back to help</Link>
                </div>
            </StorefrontShell>
        );
    }

    return (
        <StorefrontShell>
            <Head title={page.title} />
            <div
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '64px 30px',
                    display: 'grid',
                    gridTemplateColumns: '220px 1fr',
                    gap: '48px',
                }}
                className="help-layout"
            >
                <aside>
                    <Link
                        href="/help"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            color: '#999',
                            textDecoration: 'none',
                        }}
                    >
                        ← Help centre
                    </Link>
                    <nav style={{ marginTop: '24px' }}>
                        {HELP_NAV.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/help/${item.slug}`}
                                style={{
                                    display: 'block',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    padding: '8px 0',
                                    color: slug === item.slug ? '#060606' : '#6b6b6b',
                                    fontWeight: slug === item.slug ? 500 : 300,
                                    textDecoration: 'none',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <article>
                    <h1
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: '28px',
                            margin: '0 0 32px',
                            textTransform: 'uppercase',
                        }}
                    >
                        {page.title}
                    </h1>
                    {page.sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: '28px' }}>
                            {section.heading && (
                                <h2
                                    style={{
                                        fontFamily: '"Proza Libre", sans-serif',
                                        fontSize: '16px',
                                        margin: '0 0 8px',
                                    }}
                                >
                                    {section.heading}
                                </h2>
                            )}
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    color: '#6b6b6b',
                                    lineHeight: 1.8,
                                    margin: 0,
                                }}
                            >
                                {section.body}
                            </p>
                        </div>
                    ))}
                </article>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .help-layout { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </StorefrontShell>
    );
}
