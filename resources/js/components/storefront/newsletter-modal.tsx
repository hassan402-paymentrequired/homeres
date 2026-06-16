import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deferNewsletterPrompt,
    dismissNewsletterPrompt,
    subscribeNewsletter,
} from '@/lib/newsletter-subscription';

const SHOW_DELAY_MS = 1800;

export default function NewsletterModal() {
    const { showNewsletterModal } = usePage<{ showNewsletterModal: boolean }>().props;
    const [locallyDismissed, setLocallyDismissed] = useState(false);
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dismiss = useCallback(async () => {
        setVisible(false);
        setLocallyDismissed(true);

        await dismissNewsletterPrompt();
    }, []);

    useEffect(() => {
        if (!showNewsletterModal || locallyDismissed) {
            return undefined;
        }

        const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [showNewsletterModal, locallyDismissed]);

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        // Record that the prompt was shown (3-hour cooldown) without closing the modal.
        void deferNewsletterPrompt();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                void dismiss();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [visible, dismiss]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const result = await subscribeNewsletter(email, 'modal');

            if (!result.ok) {
                setError(result.message);

                return;
            }

            setSuccess(true);
            setLocallyDismissed(true);
            window.setTimeout(() => setVisible(false), 2200);
        } finally {
            setSubmitting(false);
        }
    };

    if (!showNewsletterModal || locallyDismissed || !visible) {
        return null;
    }

    return (
        <div
            className="newsletter-modal-root"
            role="dialog"
            aria-modal="true"
            aria-label="Newsletter signup"
        >
            <button
                type="button"
                className="newsletter-modal-backdrop"
                aria-label="Close newsletter signup"
                onClick={() => {
                    void dismiss();
                }}
            />

            <div className="newsletter-modal-stage">
                <svg
                    className="newsletter-rope newsletter-rope-left"
                    viewBox="0 0 40 320"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="rope-left-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8a7f6f" />
                            <stop offset="35%" stopColor="#d8cdb8" />
                            <stop offset="65%" stopColor="#9a8f7d" />
                            <stop offset="100%" stopColor="#6f6558" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M20 0 C14 80, 26 160, 20 240 C16 280, 22 310, 20 320"
                        fill="none"
                        stroke="url(#rope-left-gradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 0 C24 80, 18 160, 22 240 C24 280, 18 310, 20 320"
                        fill="none"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>

                <svg
                    className="newsletter-rope newsletter-rope-right"
                    viewBox="0 0 40 320"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="rope-right-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8a7f6f" />
                            <stop offset="35%" stopColor="#d8cdb8" />
                            <stop offset="65%" stopColor="#9a8f7d" />
                            <stop offset="100%" stopColor="#6f6558" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M20 0 C26 80, 14 160, 20 240 C24 280, 18 310, 20 320"
                        fill="none"
                        stroke="url(#rope-right-gradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 0 C16 80, 24 160, 18 240 C16 280, 22 310, 20 320"
                        fill="none"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="newsletter-signboard">
                    <button
                        type="button"
                        className="newsletter-signboard-close"
                        onClick={() => {
                            void dismiss();
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    <p className="newsletter-signboard-eyebrow">Homère Insider</p>

                    {success ? (
                        <div className="newsletter-signboard-success">
                            <p className="newsletter-signboard-title">You&apos;re on the list</p>
                            <p className="newsletter-signboard-copy">
                                Watch your inbox for curated interiors, new arrivals, and your
                                welcome offer.
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="newsletter-signboard-title">
                                Join the Homère list
                            </h2>
                            <p className="newsletter-signboard-copy">
                                Curated interiors, collectible accessories, and{' '}
                                <strong>10% off</strong> when you subscribe.
                            </p>

                            <form className="newsletter-signboard-form" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Your email address"
                                    required
                                    autoComplete="email"
                                    aria-label="Email address"
                                />
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Subscribing…' : 'Subscribe'}
                                </button>
                            </form>

                            {error && (
                                <p className="newsletter-signboard-error" role="alert">
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                className="newsletter-signboard-skip"
                                onClick={() => {
                                    void dismiss();
                                }}
                            >
                                Maybe later
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .newsletter-modal-root {
                    position: fixed;
                    inset: 0;
                    z-index: 400;
                    pointer-events: none;
                }

                .newsletter-modal-backdrop {
                    position: absolute;
                    inset: 0;
                    border: none;
                    background: rgba(6, 6, 6, 0.42);
                    backdrop-filter: blur(4px);
                    pointer-events: auto;
                    cursor: pointer;
                    animation: newsletter-fade-in 0.45s ease;
                }

                .newsletter-modal-stage {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: min(92vw, 420px);
                    transform: translateX(-50%);
                    pointer-events: none;
                    animation: newsletter-drop-in 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .newsletter-rope {
                    position: absolute;
                    top: 0;
                    width: 40px;
                    height: min(38vh, 280px);
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18));
                }

                .newsletter-rope-left {
                    left: calc(50% - 118px);
                }

                .newsletter-rope-right {
                    right: calc(50% - 118px);
                }

                .newsletter-signboard {
                    position: relative;
                    margin-top: min(34vh, 250px);
                    padding: 32px 28px 28px;
                    background: linear-gradient(180deg, #ffffff 0%, #fafaf8 100%);
                    border: 1px solid rgba(6, 6, 6, 0.08);
                    border-radius: 20px;
                    box-shadow:
                        0 24px 60px rgba(6, 6, 6, 0.16),
                        0 8px 20px rgba(6, 6, 6, 0.08);
                    pointer-events: auto;
                    transform-origin: 50% -120px;
                    animation: newsletter-swing 5.5s ease-in-out infinite;
                }

                .newsletter-signboard-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 999px;
                    background: rgba(6, 6, 6, 0.05);
                    color: #060606;
                    font-size: 22px;
                    line-height: 1;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .newsletter-signboard-close:hover {
                    background: rgba(6, 6, 6, 0.1);
                }

                .newsletter-signboard-eyebrow {
                    margin: 0 0 10px;
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 2.4px;
                    text-transform: uppercase;
                    color: #9a9a9a;
                }

                .newsletter-signboard-title {
                    margin: 0 0 10px;
                    font-family: "Proza Libre", sans-serif;
                    font-size: clamp(24px, 5vw, 30px);
                    font-weight: 500;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                    color: #060606;
                    line-height: 1.1;
                }

                .newsletter-signboard-copy {
                    margin: 0 0 22px;
                    font-family: Poppins, sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    line-height: 1.7;
                    color: #6b6b6b;
                }

                .newsletter-signboard-copy strong {
                    font-weight: 500;
                    color: #060606;
                }

                .newsletter-signboard-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .newsletter-signboard-form input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 14px 16px;
                    border: 1px solid rgba(6, 6, 6, 0.12);
                    border-radius: 12px;
                    background: #fff;
                    font-family: Poppins, sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    color: #060606;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .newsletter-signboard-form input:focus {
                    border-color: rgba(6, 6, 6, 0.35);
                    box-shadow: 0 0 0 3px rgba(6, 6, 6, 0.06);
                }

                .newsletter-signboard-form button {
                    padding: 14px 18px;
                    border: none;
                    border-radius: 12px;
                    background: #060606;
                    color: #fff;
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }

                .newsletter-signboard-form button:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .newsletter-signboard-form button:disabled {
                    opacity: 0.65;
                    cursor: wait;
                }

                .newsletter-signboard-error {
                    margin: 12px 0 0;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    color: #b42318;
                }

                .newsletter-signboard-skip {
                    display: block;
                    width: 100%;
                    margin-top: 14px;
                    padding: 0;
                    border: none;
                    background: transparent;
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 300;
                    letter-spacing: 1px;
                    color: #999;
                    cursor: pointer;
                }

                .newsletter-signboard-skip:hover {
                    color: #060606;
                }

                .newsletter-signboard-success {
                    padding-top: 8px;
                }

                @keyframes newsletter-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes newsletter-drop-in {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-28px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                @keyframes newsletter-swing {
                    0%, 100% { transform: rotate(-1.6deg); }
                    50% { transform: rotate(1.6deg); }
                }

                @media (max-width: 520px) {
                    .newsletter-rope-left {
                        left: calc(50% - 92px);
                    }

                    .newsletter-rope-right {
                        right: calc(50% - 92px);
                    }

                    .newsletter-signboard {
                        padding: 28px 22px 24px;
                        border-radius: 16px;
                    }
                }
            `}</style>
        </div>
    );
}
