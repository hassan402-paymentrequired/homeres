import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FormField, {
    FormSection,
    formSpanTwo,
} from '@/components/admin/form-field';
import SearchableSelect from '@/components/admin/searchable-select';
import TemplateFieldsEditor from '@/components/admin/template-fields-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type { ProductTemplateSpecsLayout } from '@/types/product';
import {
    PRICING_MODE_OPTIONS,
    SPECS_LAYOUT_OPTIONS,
    type ProductTemplateBreadcrumb,
    type ProductTemplateRecord,
    toEditableFields,
} from '@/types/product-template';

type Props = {
    template: ProductTemplateRecord | null;
    breadcrumbs: ProductTemplateBreadcrumb[];
};

export default function ProductTemplateForm({
    template,
    breadcrumbs,
}: Props) {
    const isEditing = template !== null;
    const cancelHref = isEditing
        ? `/admin/product-templates/${template.id}`
        : '/admin/product-templates';

    const [specFields, setSpecFields] = useState(() =>
        toEditableFields(template?.spec_fields ?? []),
    );
    const [variantOptions, setVariantOptions] = useState(() =>
        toEditableFields(template?.variant_options ?? []),
    );
    const [pricingMode, setPricingMode] = useState<'fixed' | 'on_request'>(
        template?.rules.pricing_mode ?? 'fixed',
    );
    const [requiresBrand, setRequiresBrand] = useState(
        template?.rules.requires_brand ?? true,
    );
    const [specsLayout, setSpecsLayout] = useState<ProductTemplateSpecsLayout>(
        template?.rules.specs_layout ?? 'single',
    );
    const [processing, setProcessing] = useState(false);

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);

        const formData = new FormData(event.currentTarget);
        const url = isEditing
            ? `/admin/product-templates/${template.id}`
            : '/admin/product-templates';

        if (isEditing) {
            formData.append('_method', 'PUT');
        }

        router.post(url, formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head
                title={
                    isEditing
                        ? `Edit ${template.name}`
                        : 'Create product template'
                }
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Catalog
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        {isEditing
                            ? 'Edit product template'
                            : 'Create product template'}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Define how products and variants are structured. Assign
                        this template to a category (e.g. Shoes) so new products
                        get the right fields without code changes.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full" noValidate>
                    <Card className="border-sidebar-border/70 py-0 shadow-none">
                        <CardHeader className="border-b border-sidebar-border/70 py-6">
                            <p className="text-sm font-medium">
                                Template details
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-8 ">
                            <FormSection>
                                <FormField
                                    label="Name"
                                    htmlFor="name"
                                    error={errors.name}
                                    className={formSpanTwo}
                                >
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={template?.name ?? ''}
                                        placeholder="e.g. Shoes"
                                        required
                                    />
                                </FormField>

                                <FormField
                                    label="Description"
                                    htmlFor="description"
                                    error={errors.description}
                                    className={formSpanTwo}
                                >
                                    <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={
                                            template?.description ?? ''
                                        }
                                        rows={3}
                                        placeholder="What kind of products use this template?"
                                    />
                                </FormField>
                            </FormSection>

                            <Separator />

                            <TemplateFieldsEditor
                                title="Product spec fields"
                                description="Structured fields on the product form and storefront spec table."
                                fields={specFields}
                                onChange={setSpecFields}
                                errors={errors}
                                namePrefix="spec_fields"
                            />

                            <Separator />

                            <TemplateFieldsEditor
                                title="Variant options"
                                description="Options when adding variants — e.g. size and colour. Leave empty for a single manual variant name."
                                fields={variantOptions}
                                onChange={setVariantOptions}
                                errors={errors}
                                namePrefix="variant_options"
                            />

                            <Separator />

                            <FormSection
                                title="Rules"
                                description="Defaults applied when creating products in categories that use this template."
                            >
                                <FormField
                                    label="Default pricing mode"
                                    htmlFor="rules_pricing_mode"
                                    error={errors['rules.pricing_mode']}
                                >
                                    <input
                                        type="hidden"
                                        name="rules[pricing_mode]"
                                        value={pricingMode}
                                    />
                                    <SearchableSelect
                                        id="rules_pricing_mode"
                                        value={pricingMode}
                                        onValueChange={(value) =>
                                            setPricingMode(
                                                value as
                                                    | 'fixed'
                                                    | 'on_request',
                                            )
                                        }
                                        placeholder="Select pricing mode…"
                                        searchPlaceholder="Search…"
                                        options={[...PRICING_MODE_OPTIONS]}
                                    />
                                </FormField>

                                <FormField
                                    label="Minimum images"
                                    htmlFor="rules_min_images"
                                    error={errors['rules.min_images']}
                                >
                                    <Input
                                        id="rules_min_images"
                                        name="rules[min_images]"
                                        type="number"
                                        min={0}
                                        max={20}
                                        defaultValue={
                                            template?.rules.min_images ?? 0
                                        }
                                    />
                                </FormField>

                                <div
                                    className={`flex items-start gap-3 rounded-lg border border-sidebar-border/60 bg-muted/20 px-4 py-3 ${formSpanTwo}`}
                                >
                                    <input
                                        type="hidden"
                                        name="rules[requires_brand]"
                                        value={requiresBrand ? '1' : '0'}
                                    />
                                    <Checkbox
                                        id="rules_requires_brand"
                                        checked={requiresBrand}
                                        onCheckedChange={(checked) =>
                                            setRequiresBrand(checked === true)
                                        }
                                    />
                                    <div className="grid gap-1">
                                        <label
                                            htmlFor="rules_requires_brand"
                                            className="text-sm font-medium leading-none"
                                        >
                                            Brand required
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            Products must have a brand when
                                            using this template.
                                        </p>
                                    </div>
                                </div>
                            </FormSection>

                            <Separator />

                            <FormSection
                                title="Storefront (product page)"
                                description="Controls how spec fields appear on the public product page. Field labels and order come from spec fields above."
                            >
                                <FormField
                                    label="Specs section title"
                                    htmlFor="rules_storefront_specs_title"
                                    error={errors['rules.storefront_specs_title']}
                                    hint="Optional. Leave blank to use the template name."
                                    className={formSpanTwo}
                                >
                                    <Input
                                        id="rules_storefront_specs_title"
                                        name="rules[storefront_specs_title]"
                                        defaultValue={
                                            template?.rules
                                                .storefront_specs_title ?? ''
                                        }
                                        placeholder={
                                            template?.name ??
                                            'e.g. Publication details'
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Specs layout"
                                    htmlFor="rules_specs_layout"
                                    error={errors['rules.specs_layout']}
                                    hint="Two columns works well for many short spec rows (e.g. books)."
                                >
                                    <input
                                        type="hidden"
                                        name="rules[specs_layout]"
                                        value={specsLayout}
                                    />
                                    <SearchableSelect
                                        id="rules_specs_layout"
                                        value={specsLayout}
                                        onValueChange={(value) =>
                                            setSpecsLayout(
                                                value as ProductTemplateSpecsLayout,
                                            )
                                        }
                                        placeholder="Select layout…"
                                        searchPlaceholder="Search…"
                                        options={[...SPECS_LAYOUT_OPTIONS]}
                                    />
                                </FormField>
                            </FormSection>
                        </CardContent>

                        <CardFooter className="justify-end gap-3 border-t border-sidebar-border/70 py-6">
                            <Button variant="ghost" asChild>
                                <Link href={cancelHref}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEditing
                                    ? 'Save template'
                                    : 'Create template'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
