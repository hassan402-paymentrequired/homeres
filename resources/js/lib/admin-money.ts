import { formatNgn } from '@/lib/currency';

export function formatAdminMoney(
    amount: number | null,
    hasPriceOnRequest = false,
): string {
    if (hasPriceOnRequest && amount === null) {
        return 'Price on request';
    }

    if (amount === null) {
        return '—';
    }

    return `₦${formatNgn(amount)}`;
}

export function formatAdminDate(iso: string): string {
    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}
