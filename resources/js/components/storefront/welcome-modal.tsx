import { useCallback, useEffect, useState } from 'react';
import {
    hasDismissedWelcome,
    markWelcomeDismissed,
} from '@/lib/welcome-modal';

export default function WelcomeModal() {
    const [visible, setVisible] = useState(false);

    const dismiss = useCallback(() => {
        markWelcomeDismissed();
        setVisible(false);
    }, []);

    useEffect(() => {
        if (hasDismissedWelcome()) {
            return undefined;
        }

        const timer = window.setTimeout(() => setVisible(true), 400);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dismiss();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [visible, dismiss]);

    if (!visible) {
        return null;
    }

    return (
        <div
            className="welcome-modal-root"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
        >
            <button
                type="button"
                className="welcome-modal-backdrop"
                aria-label="Close welcome message"
                onClick={dismiss}
            />

            <div className="welcome-modal-panel">
                <button
                    type="button"
                    className="welcome-modal-close"
                    onClick={dismiss}
                    aria-label="Close"
                >
                    ×
                </button>

                <p className="welcome-modal-eyebrow">A note from Homère</p>

                <h2 id="welcome-modal-title" className="welcome-modal-title">
                    Welcome to Homère
                </h2>

                <p className="welcome-modal-lead">
                    We are delighted to have you here.
                </p>

                <div className="welcome-modal-divider" aria-hidden />

                <p className="welcome-modal-disclaimer-label">Disclaimer</p>
                <p className="welcome-modal-disclaimer">
                    The products, brand names, trademarks, logos, and images
                    displayed on this website are used for reference,
                    inspiration, and product identification purposes where
                    applicable. Homère is an independent business and is not
                    affiliated with, endorsed by, sponsored by, or officially
                    associated with any of the brands featured on this website
                    unless expressly stated. All trademarks and intellectual
                    property remain the property of their respective owners.
                </p>

                <p className="welcome-modal-body">
                    At Homère, our mission is to make luxury more accessible by
                    offering competitive pricing, exceptional value, and a
                    seamless shopping experience. Whether you&apos;re looking
                    for timeless designer pieces or carefully curated luxury
                    items, we&apos;re committed to providing excellent customer
                    service, secure shopping, and reliable shipping to your
                    doorstep.
                </p>

                <p className="welcome-modal-closing">
                    Thank you for choosing Homère. We look forward to serving
                    you.
                </p>

                <button
                    type="button"
                    className="welcome-modal-cta"
                    onClick={dismiss}
                >
                    Start exploring
                </button>
            </div>

            <style>{`
                .welcome-modal-root {
                    position: fixed;
                    inset: 0;
                    z-index: 450;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    pointer-events: none;
                }

                .welcome-modal-backdrop {
                    position: absolute;
                    inset: 0;
                    border: none;
                    background: rgba(6, 6, 6, 0.48);
                    backdrop-filter: blur(5px);
                    pointer-events: auto;
                    cursor: pointer;
                    animation: welcome-fade-in 0.4s ease;
                }

                .welcome-modal-panel {
                    position: relative;
                    width: min(92vw, 520px);
                    max-height: min(88vh, 720px);
                    overflow-y: auto;
                    background: linear-gradient(180deg, #ffffff 0%, #f7f7f2 100%);
                    border: 1px solid rgba(6, 6, 6, 0.08);
                    padding: 40px 36px 32px;
                    pointer-events: auto;
                    box-shadow: 0 28px 70px rgba(6, 6, 6, 0.18);
                    animation: welcome-rise-in 0.55s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .welcome-modal-close {
                    position: absolute;
                    top: 14px;
                    right: 16px;
                    border: none;
                    background: none;
                    font-size: 28px;
                    line-height: 1;
                    color: #767676;
                    cursor: pointer;
                    padding: 4px 8px;
                }

                .welcome-modal-close:hover {
                    color: #060606;
                }

                .welcome-modal-eyebrow {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 400;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #767676;
                    margin: 0 0 14px;
                    text-align: center;
                }

                .welcome-modal-title {
                    font-family: "Proza Libre", sans-serif;
                    font-size: clamp(26px, 4vw, 32px);
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #060606;
                    text-align: center;
                    margin: 0 0 12px;
                    line-height: 1.15;
                }

                .welcome-modal-lead {
                    font-family: Poppins, sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    letter-spacing: 0.4px;
                    color: #4a4a4a;
                    text-align: center;
                    margin: 0 0 20px;
                    line-height: 1.6;
                }

                .welcome-modal-divider {
                    width: 48px;
                    height: 1px;
                    background: rgba(6, 6, 6, 0.2);
                    margin: 0 auto 20px;
                }

                .welcome-modal-disclaimer-label {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #060606;
                    margin: 0 0 8px;
                }

                .welcome-modal-disclaimer {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                    color: #6b6b6b;
                    line-height: 1.7;
                    margin: 0 0 18px;
                    padding: 14px 16px;
                    background: rgba(6, 6, 6, 0.04);
                    border-left: 2px solid rgba(6, 6, 6, 0.16);
                }

                .welcome-modal-body,
                .welcome-modal-closing {
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                    color: #4a4a4a;
                    line-height: 1.75;
                    margin: 0 0 16px;
                }

                .welcome-modal-closing {
                    margin-bottom: 28px;
                    color: #060606;
                }

                .welcome-modal-cta {
                    display: block;
                    width: 100%;
                    border: none;
                    background: #060606;
                    color: #ffffff;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    padding: 15px 24px;
                    cursor: pointer;
                    transition: background 0.25s ease;
                }

                .welcome-modal-cta:hover {
                    background: #2a2a2a;
                }

                @keyframes welcome-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes welcome-rise-in {
                    from {
                        opacity: 0;
                        transform: translateY(18px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (max-width: 520px) {
                    .welcome-modal-panel {
                        padding: 36px 22px 28px;
                    }
                }
            `}</style>
        </div>
    );
}
