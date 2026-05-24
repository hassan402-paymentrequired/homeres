import type { StorefrontProductImage } from '@/types/storefront-product';

export function resolveStorefrontImageSrc(
    src: string | null | undefined,
): string {
    const value = src?.trim() ?? '';

    if (value === '') {
        return '';
    }

    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('//')
    ) {
        try {
            const path = new URL(value, window.location.origin).pathname;

            if (path.startsWith('/storage/')) {
                return path;
            }
        } catch {
            return value;
        }

        return value;
    }

    if (value.startsWith('/')) {
        return value;
    }

    if (value.startsWith('storage/')) {
        return `/${value}`;
    }

    return `/storage/${value.replace(/^\/+/, '')}`;
}

export function primaryStorefrontImage(
    images: StorefrontProductImage[] | undefined,
): StorefrontProductImage | null {
    if (!images?.length) {
        return null;
    }

    return (
        images.find((image) => resolveStorefrontImageSrc(image.src) !== '') ??
        null
    );
}
