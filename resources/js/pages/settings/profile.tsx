import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import {
    storefrontErrorStyle,
    storefrontInputStyle,
    storefrontLabelStyle,
    storefrontPrimaryButtonStyle,
    storefrontSectionDescriptionStyle,
    storefrontSectionTitleStyle,
} from '@/lib/storefront-form-styles';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={storefrontSectionTitleStyle}>Profile information</h2>
                <p style={storefrontSectionDescriptionStyle}>
                    Update your name and email address
                </p>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                >
                    {({ processing, errors }) => (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label htmlFor="name" style={storefrontLabelStyle}>
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                    style={storefrontInputStyle}
                                />
                                {errors.name && (
                                    <p style={storefrontErrorStyle}>{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" style={storefrontLabelStyle}>
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                    style={storefrontInputStyle}
                                />
                                {errors.email && (
                                    <p style={storefrontErrorStyle}>{errors.email}</p>
                                )}
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '12px',
                                                fontWeight: 300,
                                                color: '#6b6b6b',
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                style={{
                                                    color: '#060606',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '3px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    font: 'inherit',
                                                }}
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <p
                                                style={{
                                                    marginTop: '8px',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '13px',
                                                    color: '#1a7a3c',
                                                }}
                                            >
                                                A new verification link has been
                                                sent to your email address.
                                            </p>
                                        )}
                                    </div>
                                )}

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="update-profile-button"
                                style={storefrontPrimaryButtonStyle(processing)}
                            >
                                {processing ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}
