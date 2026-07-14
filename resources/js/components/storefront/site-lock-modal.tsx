import { useEffect, useState } from 'react';
import { useSiteLock } from '@/context/SiteLockContext';
import { unlockSiteWithPassword } from '@/lib/site-lock';

export default function SiteLockModal() {
    const { enabled, isLocked, modalOpen, closeModal, markUnlocked } =
        useSiteLock();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!modalOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [modalOpen, closeModal]);

    useEffect(() => {
        if (!modalOpen) {
            setPassword('');
            setError(null);
            setShowPassword(false);
            setSubmitting(false);
        }
    }, [modalOpen]);

    if (!enabled || !isLocked || !modalOpen) {
        return null;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const result = await unlockSiteWithPassword(password);

            if (!result.ok) {
                setError(result.message ?? 'The password is incorrect.');

                return;
            }

            markUnlocked();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="site-lock-modal-root"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-lock-modal-title"
        >
            <button
                type="button"
                className="site-lock-modal-backdrop"
                aria-label="Close access password"
                onClick={closeModal}
            />

            <div className="site-lock-modal-panel">
                <button
                    type="button"
                    className="site-lock-modal-close"
                    onClick={closeModal}
                    aria-label="Close"
                >
                    ×
                </button>

                <div
                    className="site-lock-modal-hero"
                    style={{
                        backgroundImage:
                            'url(/assets/images/lock-backround.png)',
                    }}
                />

                <div className="site-lock-modal-body">
                    <p className="site-lock-modal-eyebrow">Private collection</p>
                    <h2 id="site-lock-modal-title" className="site-lock-modal-title">
                        Enter access password
                    </h2>
                    <p className="site-lock-modal-copy">
                        Product details are reserved for invited guests. Enter
                        the access password to continue shopping.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="site-lock-password" className="site-lock-modal-label">
                            Access password
                        </label>
                        <div className="site-lock-modal-field">
                            <input
                                id="site-lock-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                autoFocus
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="site-lock-modal-toggle"
                                onClick={() => setShowPassword((value) => !value)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {error && (
                            <p className="site-lock-modal-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="site-lock-modal-submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Verifying…' : 'Unlock & continue'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .site-lock-modal-root {
                    position: fixed;
                    inset: 0;
                    z-index: 480;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    pointer-events: none;
                }

                .site-lock-modal-backdrop {
                    position: absolute;
                    inset: 0;
                    border: none;
                    background: rgba(6, 6, 6, 0.52);
                    backdrop-filter: blur(5px);
                    pointer-events: auto;
                    cursor: pointer;
                    animation: site-lock-fade-in 0.35s ease;
                }

                .site-lock-modal-panel {
                    position: relative;
                    width: min(92vw, 440px);
                    background: #ffffff;
                    border: 1px solid rgba(6, 6, 6, 0.08);
                    overflow: hidden;
                    pointer-events: auto;
                    box-shadow: 0 28px 70px rgba(6, 6, 6, 0.2);
                    animation: site-lock-rise-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .site-lock-modal-hero {
                    height: 120px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .site-lock-modal-hero::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.88));
                }

                .site-lock-modal-close {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    z-index: 2;
                    border: none;
                    background: rgba(255, 255, 255, 0.86);
                    width: 32px;
                    height: 32px;
                    font-size: 22px;
                    line-height: 1;
                    color: #767676;
                    cursor: pointer;
                }

                .site-lock-modal-body {
                    padding: 24px 28px 28px;
                }

                .site-lock-modal-eyebrow {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #767676;
                    margin: 0 0 10px;
                    text-align: center;
                }

                .site-lock-modal-title {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 22px;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #060606;
                    text-align: center;
                    margin: 0 0 10px;
                    line-height: 1.2;
                }

                .site-lock-modal-copy {
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                    font-weight: 300;
                    color: #6b6b6b;
                    text-align: center;
                    line-height: 1.65;
                    margin: 0 0 22px;
                }

                .site-lock-modal-label {
                    display: block;
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #060606;
                    margin-bottom: 6px;
                }

                .site-lock-modal-field {
                    position: relative;
                    margin-bottom: 12px;
                }

                .site-lock-modal-field input {
                    width: 100%;
                    box-sizing: border-box;
                    font-family: Poppins, sans-serif;
                    font-size: 13px;
                    font-weight: 300;
                    color: #060606;
                    background: #ffffff;
                    border: 1px solid #d0d0cc;
                    padding: 13px 64px 13px 14px;
                    outline: none;
                }

                .site-lock-modal-toggle {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: none;
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #767676;
                    cursor: pointer;
                }

                .site-lock-modal-error {
                    color: #b42318;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    margin: 0 0 12px;
                }

                .site-lock-modal-submit {
                    width: 100%;
                    border: none;
                    background: #060606;
                    color: #ffffff;
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    padding: 14px 24px;
                    cursor: pointer;
                }

                .site-lock-modal-submit:disabled {
                    background: #767676;
                    cursor: not-allowed;
                }

                @keyframes site-lock-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes site-lock-rise-in {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
