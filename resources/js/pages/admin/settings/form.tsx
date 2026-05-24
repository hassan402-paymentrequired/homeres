import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FormField, { FormSection } from '@/components/admin/form-field';
import SearchableSelect from '@/components/admin/searchable-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type { ProductPublishStatus } from '@/types/product';

type SettingsRecord = {
    store_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    default_product_status: ProductPublishStatus;
    invoice_due_days: number;
    invoice_default_notes: string | null;
    invoice_payment_instructions: string | null;
};

type Breadcrumb = {
    id: string;
    name: string;
    href: string;
};

type Props = {
    settings: SettingsRecord;
    breadcrumbs: Breadcrumb[];
};

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
];

export default function AdminSettingsForm({ settings, breadcrumbs }: Props) {
    const [defaultStatus, setDefaultStatus] = useState<ProductPublishStatus>(
        settings.default_product_status,
    );

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title="Settings" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Store
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Settings
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Store identity, contact details, catalog defaults, and
                        invoicing configuration used across admin and customer
                        emails.
                    </p>
                </div>

                <Form
                    action="/admin/settings"
                    method="put"
                    className="w-full max-w-3xl"
                >
                    {({ processing, errors }) => (
                        <Card className="border-sidebar-border/70 py-0 shadow-none">
                            <CardHeader className="border-b border-sidebar-border/70 py-6">
                                <p className="text-sm font-medium">
                                    Store configuration
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-8 py-6">
                                <FormSection title="Store identity">
                                    <FormField
                                        label="Store name"
                                        htmlFor="store_name"
                                        hint="Shown on invoices and customer emails. Leave blank to use the app name."
                                        error={errors.store_name}
                                    >
                                        <Input
                                            id="store_name"
                                            name="store_name"
                                            defaultValue={settings.store_name ?? ''}
                                            placeholder="Homère"
                                        />
                                    </FormField>
                                </FormSection>

                                <FormSection title="Contact">
                                    <FormField
                                        label="Contact email"
                                        htmlFor="contact_email"
                                        error={errors.contact_email}
                                    >
                                        <Input
                                            id="contact_email"
                                            name="contact_email"
                                            type="email"
                                            defaultValue={
                                                settings.contact_email ?? ''
                                            }
                                            placeholder="hello@homere.com"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Contact phone"
                                        htmlFor="contact_phone"
                                        error={errors.contact_phone}
                                    >
                                        <Input
                                            id="contact_phone"
                                            name="contact_phone"
                                            defaultValue={
                                                settings.contact_phone ?? ''
                                            }
                                            placeholder="+234 …"
                                        />
                                    </FormField>
                                </FormSection>

                                <FormSection title="Invoicing">
                                    <FormField
                                        label="Default due days"
                                        htmlFor="invoice_due_days"
                                        hint="Due date for new invoices created from orders or the composer."
                                        error={errors.invoice_due_days}
                                    >
                                        <Input
                                            id="invoice_due_days"
                                            name="invoice_due_days"
                                            type="number"
                                            min={1}
                                            max={365}
                                            defaultValue={String(
                                                settings.invoice_due_days,
                                            )}
                                        />
                                    </FormField>

                                    <FormField
                                        label="Default invoice notes"
                                        htmlFor="invoice_default_notes"
                                        hint="Pre-filled on new invoices when the order has no customer note."
                                        error={errors.invoice_default_notes}
                                    >
                                        <Textarea
                                            id="invoice_default_notes"
                                            name="invoice_default_notes"
                                            rows={3}
                                            defaultValue={
                                                settings.invoice_default_notes ??
                                                ''
                                            }
                                            placeholder="Payment terms, delivery notes…"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Payment instructions"
                                        htmlFor="invoice_payment_instructions"
                                        hint="Shown on invoice previews and emails. Paystack payment links will be added later."
                                        error={errors.invoice_payment_instructions}
                                    >
                                        <Textarea
                                            id="invoice_payment_instructions"
                                            name="invoice_payment_instructions"
                                            rows={3}
                                            defaultValue={
                                                settings.invoice_payment_instructions ??
                                                ''
                                            }
                                        />
                                    </FormField>
                                </FormSection>

                                <FormSection title="Catalog defaults">
                                    <FormField
                                        label="Default product status"
                                        htmlFor="default_product_status"
                                        error={errors.default_product_status}
                                        hint="Used when importing scraped products."
                                    >
                                        <input
                                            type="hidden"
                                            name="default_product_status"
                                            value={defaultStatus}
                                        />
                                        <SearchableSelect
                                            id="default_product_status"
                                            value={defaultStatus}
                                            onValueChange={(value) =>
                                                setDefaultStatus(
                                                    value as ProductPublishStatus,
                                                )
                                            }
                                            placeholder="Select default status…"
                                            searchPlaceholder="Search status…"
                                            options={STATUS_OPTIONS}
                                        />
                                    </FormField>
                                </FormSection>
                            </CardContent>

                            <CardFooter className="justify-end gap-3 border-t border-sidebar-border/70 py-6">
                                <Button variant="ghost" asChild>
                                    <Link href="/admin">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save settings
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </Form>
            </div>
        </AdminLayout>
    );
}
