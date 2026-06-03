export const CURRENCY_SYMBOL = '₦';

export function formatNgn(amount: number): string {
    return amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatUsd(amount: number): string {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatStorefrontMoney(
    amount: number,
    currency: 'NGN' | 'USD',
): string {
    return currency === 'USD'
        ? `$${formatUsd(amount)}`
        : `₦${formatNgn(amount)}`;
}

export type PaymentProvider = 'paystack' | 'stripe';

export type CheckoutExchangeRates = {
    ngnToUsd: number;
    usdToNgn: number;
};

export function currencyForPaymentProvider(
    provider: PaymentProvider,
): 'NGN' | 'USD' {
    return provider === 'paystack' ? 'NGN' : 'USD';
}

export function defaultPaymentProvider(isNigeria: boolean): PaymentProvider {
    return isNigeria ? 'paystack' : 'stripe';
}

export function convertBetweenDisplayCurrencies(
    amount: number,
    from: 'NGN' | 'USD',
    to: 'NGN' | 'USD',
    rates: CheckoutExchangeRates,
): number {
    if (from === to) {
        return amount;
    }

    if (from === 'NGN') {
        return Math.round(amount * rates.ngnToUsd * 100) / 100;
    }

    return Math.round(amount * rates.usdToNgn * 100) / 100;
}
