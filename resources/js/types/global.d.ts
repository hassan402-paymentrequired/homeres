import type { Auth } from '@/types/auth';
import type { StorefrontCurrencyProps } from '@/hooks/use-storefront-currency';
import type { StorefrontNavItem } from '@/types/storefront-navigation';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            storefrontNav: StorefrontNavItem[];
            storefrontCurrency: StorefrontCurrencyProps | null;
            showNewsletterModal: boolean;
            [key: string]: unknown;
        };
    }
}
