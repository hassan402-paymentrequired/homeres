interface ImageLightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    return (
        <div
            role="dialog"
            aria-modal
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 250,
                background: 'rgba(6,6,6,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '28px',
                    cursor: 'pointer',
                }}
            >
                ×
            </button>
            <img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                }}
            />
        </div>
    );
}
