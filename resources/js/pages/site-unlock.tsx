import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { store } from '@/routes/site-lock';

export default function SiteUnlock() {
    const [showPassword, setShowPassword] = useState(false);

    const inputStyle: React.CSSProperties = {
        width: '100%',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontWeight: 300,
        letterSpacing: '0.5px',
        color: '#060606',
        background: '#ffffff',
        border: '1px solid #d0d0cc',
        padding: '13px 14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '1.5px',
        textTransform: 'uppercase' as const,
        color: '#060606',
        display: 'block',
        marginBottom: '6px',
    };

    return (
        <>
            <Head title="Enter access password" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: '#060606',
                            background: '#ffffff',
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '420px',
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#767676',
                                        marginBottom: '12px',
                                    }}
                                >
                                    Private preview
                                </p>
                                <img
                                    src="/logo.png"
                                    alt="HOMÈRE"
                                    style={{
                                        width: '120px',
                                        height: '60px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        margin: '0 auto',
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 300,
                                        color: '#767676',
                                        marginTop: '12px',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    This site is password protected. Enter the
                                    access password you received to continue.
                                </p>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="password" style={labelStyle}>
                                    Access password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoFocus
                                        autoComplete="current-password"
                                        style={inputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '11px',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                            color: '#767676',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p
                                        style={{
                                            color: '#b42318',
                                            fontSize: '12px',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#ffffff',
                                    background: processing ? '#767676' : '#060606',
                                    border: 'none',
                                    padding: '15px 24px',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Verifying...' : 'Unlock site'}
                            </button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}
