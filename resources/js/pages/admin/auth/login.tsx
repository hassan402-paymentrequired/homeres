import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
    status?: string;
};

export default function AdminLogin({ status }: Props) {
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
        textTransform: 'uppercase',
        color: '#060606',
        display: 'block',
        marginBottom: '6px',
    };

    return (
        <>
            <Head title="Admin sign in" />

            <Form
                action="/admin/login"
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: '#060606',
                            background: '#f5f5f3',
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 20px',
                        }}
                    >
                        <div style={{ width: '100%', maxWidth: '420px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <img
                                    src="/logo.png"
                                    alt="Homère"
                                    style={{
                                        width: '88px',
                                        height: '44px',
                                        objectFit: 'contain',
                                        margin: '0 auto 20px',
                                        display: 'block',
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: '10px',
                                        letterSpacing: '2.5px',
                                        textTransform: 'uppercase',
                                        color: '#6b6b6b',
                                        margin: '0 0 8px',
                                    }}
                                >
                                    Admin portal
                                </p>
                                <h1
                                    style={{
                                        fontFamily: '"Proza Libre", sans-serif',
                                        fontSize: '24px',
                                        fontWeight: 500,
                                        margin: 0,
                                    }}
                                >
                                    Sign in to manage Homère
                                </h1>
                            </div>

                            <div
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e8e8e1',
                                    padding: '32px 28px',
                                }}
                            >
                                {status && (
                                    <p
                                        style={{
                                            fontSize: '13px',
                                            color: '#1a7a3c',
                                            marginBottom: '16px',
                                        }}
                                    >
                                        {status}
                                    </p>
                                )}

                                <div style={{ marginBottom: '18px' }}>
                                    <label htmlFor="email" style={labelStyle}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        required
                                        style={inputStyle}
                                    />
                                    {errors.email && (
                                        <p style={{ color: '#b42318', fontSize: '12px', marginTop: '6px' }}>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div style={{ marginBottom: '18px' }}>
                                    <label htmlFor="password" style={labelStyle}>
                                        Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            style={{ ...inputStyle, paddingRight: '72px' }}
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
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                color: '#6b6b6b',
                                            }}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p style={{ color: '#b42318', fontSize: '12px', marginTop: '6px' }}>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: '#6b6b6b',
                                        marginBottom: '24px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input type="checkbox" name="remember" value="1" />
                                    Remember me
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%',
                                        background: processing ? '#6b6b6b' : '#060606',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '15px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        cursor: processing ? 'wait' : 'pointer',
                                    }}
                                >
                                    {processing ? 'Signing in…' : 'Sign in'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}
