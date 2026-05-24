type Props = {
    title: string;
    description: string | null;
    imageUrl: string;
    productCount?: number;
};

export default function CatalogCategoryBanner({
    title,
    description,
    imageUrl,
    productCount,
}: Props) {
    return (
        <section
            className="catalog-category-banner rounded-2xl"
            style={{
                position: 'relative',
                marginBottom: '32px',
                minHeight: '220px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                backgroundColor: '#1a1a1a',
            }}
        >
            <img
                src={imageUrl}
                alt=""
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.15) 100%)',
                }}
            />
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '40px 36px',
                    maxWidth: '640px',
                }}
            >
                <h1
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        margin: '0 0 12px',
                        letterSpacing: '0.04em',
                    }}
                >
                    {title}
                </h1>
                {description ? (
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: 300,
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.88)',
                            margin: 0,
                        }}
                    >
                        {description}
                    </p>
                ) : null}
                {productCount !== undefined ? (
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px',
                            fontWeight: 400,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.65)',
                            margin: description ? '12px 0 0' : '12px 0 0',
                        }}
                    >
                        {productCount} {productCount === 1 ? 'product' : 'products'}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
