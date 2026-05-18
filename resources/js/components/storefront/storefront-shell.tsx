import React from 'react';
import SiteFooter from '@/pages/landing/components/site-footer';
import SiteHeader from '@/pages/landing/components/site-header';

const pageStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 300,
    color: '#060606',
    background: '#ffffff',
    minHeight: '100vh',
};

interface StorefrontShellProps {
    children: React.ReactNode;
}

export default function StorefrontShell({ children }: StorefrontShellProps) {
    return (
        <div style={pageStyle}>
            <SiteHeader />
            <main id="MainContent">{children}</main>
            <SiteFooter />
        </div>
    );
}
