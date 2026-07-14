import { useOptionalSiteLock } from '@/context/SiteLockContext';

export default function ProductLockOverlay({
    label = 'Unlock to view products',
}: {
    label?: string;
}) {
    const siteLock = useOptionalSiteLock();

    if (!siteLock?.isLocked) {
        return null;
    }

    return (
        <div className="product-lock-overlay">
            <button
                type="button"
                className="product-lock-overlay-button"
                onClick={() => siteLock.requestAccess()}
            >
                <span className="product-lock-overlay-eyebrow">Access required</span>
                <span className="product-lock-overlay-label">{label}</span>
            </button>

            <style>{`
                .product-lock-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: rgba(250, 250, 247, 0.72);
                    backdrop-filter: blur(7px);
                }

                .product-lock-overlay-button {
                    border: 1px solid rgba(6, 6, 6, 0.12);
                    background: rgba(255, 255, 255, 0.94);
                    padding: 22px 28px;
                    cursor: pointer;
                    text-align: center;
                    box-shadow: 0 16px 40px rgba(6, 6, 6, 0.1);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .product-lock-overlay-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 48px rgba(6, 6, 6, 0.14);
                }

                .product-lock-overlay-eyebrow {
                    display: block;
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #767676;
                    margin-bottom: 8px;
                }

                .product-lock-overlay-label {
                    display: block;
                    font-family: "Proza Libre", sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #060606;
                }
            `}</style>
        </div>
    );
}
