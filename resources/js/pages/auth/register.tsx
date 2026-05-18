import { Form, Head, Link } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import { login } from '@/routes';
import { useState } from 'react';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

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
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
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
                        {/* Header */}
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
                                href="/"
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '22px',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: '#060606',
                                    textDecoration: 'none',
                                }}
                            >
                                HEMERE
                            </Link>
                            <Link
                                href="/"
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

                        {/* Main */}
                        <main
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px 24px',
                            }}
                        >
                            <div style={{ width: '100%', maxWidth: '480px' }}>
                                {/* Title */}
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
                                        Create Account
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
                                        Join Hemere for a curated living
                                        experience
                                    </p>
                                </div>

                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    style={{ display: 'grid', gap: '20px' }}
                                >
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '16px',
                                        }}
                                    >
                                        <div>
                                            <label style={labelStyle}>
                                                First Name
                                            </label>
                                            <input
                                                name="firstName"
                                                type="text"
                                                value={form.firstName}
                                                onChange={handleChange}
                                                placeholder="First name"
                                                required
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>
                                                Last Name
                                            </label>
                                            <input
                                                name="lastName"
                                                type="text"
                                                value={form.lastName}
                                                onChange={handleChange}
                                                placeholder="Last name"
                                                required
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>
                                            Email Address
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Create a password"
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
                                        <p
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '11px',
                                                fontWeight: 300,
                                                color: '#999',
                                                letterSpacing: '0.5px',
                                                margin: '6px 0 0',
                                            }}
                                        >
                                            Minimum 8 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>
                                            Confirm Password
                                        </label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repeat your password"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            marginTop: '4px',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            required
                                            style={{
                                                marginTop: '2px',
                                                cursor: 'pointer',
                                                accentColor: '#060606',
                                            }}
                                        />
                                        <label
                                            htmlFor="terms"
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                                fontSize: '11px',
                                                fontWeight: 300,
                                                color: '#6b6b6b',
                                                letterSpacing: '0.5px',
                                                lineHeight: '1.6',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            I agree to the{' '}
                                            <span
                                                style={{
                                                    color: '#060606',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '3px',
                                                }}
                                            >
                                                Terms of Service
                                            </span>{' '}
                                            and{' '}
                                            <span
                                                style={{
                                                    color: '#060606',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '3px',
                                                }}
                                            >
                                                Privacy Policy
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            background: '#060606',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '16px',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            letterSpacing: '2.5px',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                            marginTop: '8px',
                                        }}
                                        onMouseEnter={(e) =>
                                            ((
                                                e.currentTarget as HTMLButtonElement
                                            ).style.background = '#333')
                                        }
                                        onMouseLeave={(e) =>
                                            ((
                                                e.currentTarget as HTMLButtonElement
                                            ).style.background = '#060606')
                                        }
                                    >
                                        Create Account
                                    </button>
                                </form>

                                {/* Login link */}
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 300,
                                        color: '#6b6b6b',
                                        letterSpacing: '0.5px',
                                        margin: '32px 0 0',
                                    }}
                                >
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        style={{
                                            color: '#060606',
                                            fontWeight: 500,
                                            textDecoration: 'underline',
                                            textUnderlineOffset: '3px',
                                        }}
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </main>
                    </div>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
