import { PREVIEW_NOTICE } from '@/data/brand';

export default function PreviewBanner() {
    return (
        <div
            role="status"
            style={{
                background: '#060606',
                color: '#ffffff',
                textAlign: 'center',
                padding: '8px 30px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                lineHeight: 1.5,
            }}
        >
            {PREVIEW_NOTICE}
        </div>
    );
}
