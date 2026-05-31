import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartModal from './pages/landing/components/cart-modal';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('about/'):
            case name.startsWith('services/'):
            case name.startsWith('contact/'):
            case name.startsWith('catalog/'):
            case name.startsWith('help/'):
            case name.startsWith('wishlist/'):
                return null;
            case name.startsWith('checkout/'):
                return null;
            case name.startsWith('auth/'):
                return null;
            case name.startsWith('product/'):
                return null;
            case name.startsWith('admin/'):
                return null;
            case name.startsWith('settings/'):
                return SettingsLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <CartProvider>
                    <WishlistProvider>
                        {app}
                        <CartModal />
                        <Toaster />
                    </WishlistProvider>
                </CartProvider>
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Homère always uses light mode — strip any stale dark class on load.
initializeTheme();
