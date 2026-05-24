import { usePage } from '@inertiajs/react';

export type StorefrontCurrencyProps = {
    currency: 'NGN' | 'USD';
    country: string;
    is_nigeria: boolean;
};

export function useStorefrontCurrency(): StorefrontCurrencyProps | null {
    const { storefrontCurrency } = usePage<{ storefrontCurrency: StorefrontCurrencyProps | null }>()
        .props;

    return storefrontCurrency ?? null;
}
