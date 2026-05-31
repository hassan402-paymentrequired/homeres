import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { home, register } from '@/routes';
import { email as forgotPassword } from '@/routes/password';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
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
            <Head title="Log in" />

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
                            flexDirection: 'column',
                        }}
                    >
                        <header
                            style={{
                                borderBottom: '1px solid #e8e8e1',
                                padding: '0 40px',
                                height: '64px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Link
                                href={home().url}
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '64px',
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Homère logo"
                                    style={{
                                        width: '88px',
                                        height: '44px',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Link>
                            <Link
                                href={home().url}
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 300,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    color: '#666',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                Back to shop
                            </Link>
                        </header>

                        <main
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px 24px',
                            }}
                        >
                            <div style={{ width: '100%', maxWidth: '440px' }}>
                                <div
                                    style={{
                                        marginBottom: '40px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontFamily:
                                                '"Proza Libre", sans-serif',
                                            fontSize: '28px',
                                            fontWeight: 500,
                                            color: '#060606',
                                            margin: '0 0 10px',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        Sign In
                                    </h1>
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 300,
                                            color: '#6b6b6b',
                                            letterSpacing: '0.5px',
                                            margin: 0,
                                        }}
                                    >
                                        Welcome back to Homère
                                    </p>
                                </div>

                                {status && (
                                    <p
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '13px',
                                            color: '#1a7a3c',
                                            textAlign: 'center',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        {status}
                                    </p>
                                )}

                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label htmlFor="email" style={labelStyle}>
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            autoFocus
                                            placeholder="your@email.com"
                                            required
                                            style={inputStyle}
                                        />
                                        {errors.email && (
                                            <p
                                                style={{
                                                    color: '#b42318',
                                                    fontSize: '12px',
                                                    marginTop: '6px',
                                                }}
                                            >
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" style={labelStyle}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                required
                                                style={{
                                                    ...inputStyle,
                                                    paddingRight: '44px',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform:
                                                        'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#6b6b6b',
                                                    padding: '4px',
                                                }}
                                                aria-label={
                                                    showPassword
                                                        ? 'Hide password'
                                                        : 'Show password'
                                                }
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                        <line
                                                            x1="1"
                                                            y1="1"
                                                            x2="23"
                                                            y2="23"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p
                                                style={{
                                                    color: '#b42318',
                                                    fontSize: '12px',
                                                    marginTop: '6px',
                                                }}
                                            >
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {canResetPassword && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <Link
                                                href={forgotPassword().url}
                                                style={{
                                                    fontFamily:
                                                        'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    fontWeight: 300,
                                                    letterSpacing: '1px',
                                                    color: '#060606',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '3px',
                                                }}
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            width: '100%',
                                            background: processing
                                                ? '#6b6b6b'
                                                : '#060606',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '16px',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            letterSpacing: '2.5px',
                                            textTransform: 'uppercase',
                                            cursor: processing
                                                ? 'wait'
                                                : 'pointer',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {processing ? 'Signing in…' : 'Sign In'}
                                    </button>
                                </div>

                                {canRegister && (
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                margin: '32px 0',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: '1px',
                                                    background: '#e8e8e1',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontFamily:
                                                        'Poppins, sans-serif',
                                                    fontSize: '11px',
                                                    fontWeight: 300,
                                                    color: '#999',
                                                    letterSpacing: '1px',
                                                }}
                                            >
                                                OR
                                            </span>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: '1px',
                                                    background: '#e8e8e1',
                                                }}
                                            />
                                        </div>

                                        <p
                                            style={{
                                                textAlign: 'center',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                fontWeight: 300,
                                                color: '#6b6b6b',
                                                letterSpacing: '0.5px',
                                                margin: 0,
                                            }}
                                        >
                                            New to Homère?{' '}
                                            <Link
                                                href={register().url}
                                                style={{
                                                    color: '#060606',
                                                    fontWeight: 500,
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '3px',
                                                }}
                                            >
                                                Create an account
                                            </Link>
                                        </p>
                                    </>
                                )}
                            </div>
                        </main>
                    </div>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
