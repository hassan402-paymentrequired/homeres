import React from 'react';
import ChatWidget from '@/components/storefront/chat/chat-widget';
import NewsletterModal from '@/components/storefront/newsletter-modal';
import SiteLockModal from '@/components/storefront/site-lock-modal';
import WelcomeModal from '@/components/storefront/welcome-modal';
import { SiteLockProvider } from '@/context/SiteLockContext';
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
        <SiteLockProvider>
            <div style={pageStyle}>
                <a
                    href="#MainContent"
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: 'auto',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.position = 'fixed';
                        e.currentTarget.style.left = '16px';
                        e.currentTarget.style.top = '16px';
                        e.currentTarget.style.width = 'auto';
                        e.currentTarget.style.height = 'auto';
                        e.currentTarget.style.padding = '12px 16px';
                        e.currentTarget.style.background = '#060606';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.zIndex = '9999';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.position = 'absolute';
                        e.currentTarget.style.left = '-9999px';
                    }}
                >
                    Skip to content
                </a>
                <SiteHeader />
                <main id="MainContent">{children}</main>
                <SiteFooter />
                <WelcomeModal />
                <SiteLockModal />
                <NewsletterModal />
                <ChatWidget />
            </div>
        </SiteLockProvider>
    );
}
