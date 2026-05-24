import { router } from '@inertiajs/react';
import { useState } from 'react';
import FormField, { FormSection } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
        <Card className="border-sidebar-border/70 py-0 shadow-none">
            <CardHeader className="border-b border-sidebar-border/70 py-6">
                <p className="text-sm font-medium">Send invoice</p>
                {hint ? (
                    <p className="text-sm text-muted-foreground">{hint}</p>
                ) : null}
            </CardHeader>

            <CardContent className="space-y-6 py-6">
                <FormSection>
                    <FormField
                        label="Recipient email"
                        htmlFor="recipient_email"
                        error={errors.recipient_email}
                    >
                        <Input
                            id="recipient_email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </FormField>

                    <FormField
                        label="Personal message"
                        htmlFor="message"
                        hint="Optional note included at the top of the email."
                        error={errors.message}
                    >
                        <Textarea
                            id="message"
                            rows={3}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Thank you for your order…"
                        />
                    </FormField>
                </FormSection>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 border-t border-sidebar-border/70 py-4">
                {secondaryLabel ? (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => submit(false)}
                    >
                        {secondaryLabel}
                    </Button>
                ) : null}
                <Button
                    type="button"
                    disabled={processing}
                    onClick={() => submit(secondaryLabel ? true : undefined)}
                >
                    {submitLabel}
                </Button>
            </CardFooter>
        </Card>
    );
}
