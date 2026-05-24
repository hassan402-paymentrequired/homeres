export const CURRENCY_SYMBOL = '₦';

export function formatNgn(amount: number): string {
    return amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
