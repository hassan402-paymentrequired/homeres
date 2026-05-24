type AdminImageSource = {
    url?: string | null;
    path?: string | null;
};

export function resolveAdminProductImageSrc(image: AdminImageSource): string {
    const url = image.url?.trim() ?? '';

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
    }

    if (url.startsWith('/')) {
        return url;
    }

    const path = image.path?.trim() ?? '';

    if (path === '') {
        return url;
    }

    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
}
