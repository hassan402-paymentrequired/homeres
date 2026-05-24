import { router } from '@inertiajs/react';
import { useStorefrontCurrency } from '@/hooks/use-storefront-currency';

const options = [
    { code: 'NGN' as const, label: '₦ NGN' },
    { code: 'USD' as const, label: '$ USD' },
];

export default function StorefrontCurrencySelect() {
    const currency = useStorefrontCurrency();

    if (!currency) {
        return null;
    }

    return (
        <select
            value={currency.currency}
            onChange={(e) => {
                router.post(
                    '/storefront/currency',
                    { currency: e.target.value },
                    { preserveScroll: true },
                );
            }}
            aria-label="Display currency"
            style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                padding: '6px 8px',
                border: '1px solid #e8e8e1',
                background: '#fff',
                color: '#060606',
                cursor: 'pointer',
            }}
        >
            {options.map((option) => (
                <option key={option.code} value={option.code}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
