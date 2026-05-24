import { resolveStorefrontImageSrc } from '@/lib/storefront-image';

type Props = {
    src: string;
    alt: string;
    width: number | string;
    height: number | string;
};

export default function CartLineImage({ src, alt, width, height }: Props) {
    const resolved = resolveStorefrontImageSrc(src);

    return (
        <div
            style={{
                width,
                height,
                flexShrink: 0,
                background: '#f5f5f3',
                overflow: 'hidden',
            }}
        >
            {resolved ? (
                <img
                    src={resolved}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            ) : null}
        </div>
    );
}
