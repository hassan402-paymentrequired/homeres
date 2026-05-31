import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    adminCompactPrimaryButtonStyle,
    adminCompactSecondaryButtonStyle,
    storefrontErrorStyle,
    storefrontHintStyle,
    storefrontInputStyle,
    storefrontLabelStyle,
    storefrontTextareaStyle,
} from '@/lib/storefront-form-styles';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

type Props = {
    action: string;
    defaultEmail: string;
    submitLabel: string;
    secondaryLabel?: string;
    errors?: Record<string, string>;
    hint?: string;
};

export default function InvoiceSendForm({
    action,
    defaultEmail,
    submitLabel,
    secondaryLabel,
    errors = {},
    hint,
}: Props) {
    const [email, setEmail] = useState(defaultEmail);
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit = (send?: boolean) => {
        setProcessing(true);

        router.post(
            action,
            {
                recipient_email: email,
                message: message || null,
                ...(send !== undefined ? { send: send ? '1' : '0' } : {}),
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <Card className="h-full border-sidebar-border/70 py-0 shadow-none">
            <CardHeader className="border-b border-sidebar-border/70 py-6">
                <p
                    style={{
                        fontFamily: '"Proza Libre", sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#060606',
                        margin: 0,
                    }}
                >
                    Send invoice
                </p>
                {hint ? (
                    <p style={{ ...storefrontHintStyle, marginTop: '8px' }}>
                        {hint}
                    </p>
                ) : null}
            </CardHeader>

            <CardContent className="space-y-6 py-6">
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label
                            htmlFor="recipient_email"
                            style={storefrontLabelStyle}
                        >
                            Recipient email
                        </label>
                        <input
                            id="recipient_email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            style={storefrontInputStyle}
                        />
                        {errors.recipient_email ? (
                            <p style={storefrontErrorStyle}>
                                {errors.recipient_email}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="message" style={storefrontLabelStyle}>
                            Personal message
                        </label>
                        <textarea
                            id="message"
                            rows={3}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Thank you for your order…"
                            style={storefrontTextareaStyle}
                        />
                        <p style={storefrontHintStyle}>
                            Optional note included at the top of the email.
                        </p>
                        {errors.message ? (
                            <p style={storefrontErrorStyle}>{errors.message}</p>
                        ) : null}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 border-t border-sidebar-border/70 py-4">
                {secondaryLabel ? (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => submit(false)}
                        style={adminCompactSecondaryButtonStyle}
                    >
                        {secondaryLabel}
                    </button>
                ) : null}
                <button
                    type="button"
                    disabled={processing}
                    onClick={() => submit(secondaryLabel ? true : undefined)}
                    style={adminCompactPrimaryButtonStyle(processing)}
                >
                    {submitLabel}
                </button>
            </CardFooter>
        </Card>
    );
}
