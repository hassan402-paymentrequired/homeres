import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import {
    storefrontDestructiveButtonStyle,
    storefrontErrorStyle,
    storefrontInputStyle,
    storefrontLabelStyle,
    storefrontPrimaryButtonStyle,
    storefrontSecondaryButtonStyle,
    storefrontSectionDescriptionStyle,
    storefrontSectionTitleStyle,
} from '@/lib/storefront-form-styles';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div
            style={{
                paddingTop: '48px',
                borderTop: '1px solid #e8e8e1',
            }}
        >
            <h2 style={storefrontSectionTitleStyle}>Delete account</h2>
            <p style={storefrontSectionDescriptionStyle}>
                Delete your account and all of its resources
            </p>

            <div
                style={{
                    border: '1px solid #f0d4d4',
                    background: '#fdf5f5',
                    padding: '20px',
                    marginBottom: '20px',
                }}
            >
                <p
                    style={{
                        margin: '0 0 4px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: '#b42318',
                    }}
                >
                    Warning
                </p>
                <p
                    style={{
                        margin: 0,
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 300,
                        color: '#6b6b6b',
                        lineHeight: 1.6,
                    }}
                >
                    Please proceed with caution, this cannot be undone.
                </p>
            </div>

            <button
                type="button"
                data-test="delete-user-button"
                onClick={() => setDialogOpen(true)}
                style={storefrontDestructiveButtonStyle()}
            >
                Delete account
            </button>

            {dialogOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-account-title"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        background: 'rgba(0,0,0,0.35)',
                    }}
                    onClick={() => setDialogOpen(false)}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '440px',
                            background: '#ffffff',
                            border: '1px solid #e8e8e1',
                            padding: '32px 28px',
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3
                            id="delete-account-title"
                            style={{
                                ...storefrontSectionTitleStyle,
                                fontSize: '18px',
                                marginBottom: '12px',
                            }}
                        >
                            Are you sure you want to delete your account?
                        </h3>
                        <p
                            style={{
                                ...storefrontSectionDescriptionStyle,
                                marginBottom: '24px',
                            }}
                        >
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm.
                        </p>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            onSuccess={() => setDialogOpen(false)}
                            resetOnSuccess
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            style={storefrontLabelStyle}
                                        >
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            ref={passwordInput}
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            style={storefrontInputStyle}
                                        />
                                        {errors.password && (
                                            <p style={storefrontErrorStyle}>
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetAndClearErrors();
                                                setDialogOpen(false);
                                            }}
                                            style={storefrontSecondaryButtonStyle}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="confirm-delete-user-button"
                                            style={storefrontDestructiveButtonStyle(
                                                processing,
                                            )}
                                        >
                                            {processing
                                                ? 'Deleting…'
                                                : 'Delete account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}
