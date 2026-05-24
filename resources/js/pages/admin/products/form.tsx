import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import FormField, {
    FormSection,
    formSpanTwo,
} from '@/components/admin/form-field';
import ProductImagesField from '@/components/admin/product-images-field';
import SearchableSelect from '@/components/admin/searchable-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type {
    BrandOption,
    ProductBreadcrumb,
    ProductCategoryOption,
    ProductRecord,
    ProductTemplateField,
} from '@/types/product';

type Props = {
    product: ProductRecord | null;
    prefillCategoryId: string | null;
    prefillBrandId: string | null;
    categories: ProductCategoryOption[];
    brands: BrandOption[];
    breadcrumbs: ProductBreadcrumb[];
};

const PUBLISH_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
] as const;

function SpecFieldInput({
    field,
    defaultValue,
}: {
    field: ProductTemplateField;
    defaultValue?: string;
}) {
    const [value, setValue] = useState(defaultValue ?? '');

    if (field.type === 'textarea') {
        return (
            <>
                <input type="hidden" name={`specs[${field.key}]`} value={value} />
                <Textarea
                    id={`specs_${field.key}`}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}…`}
                    rows={4}
                />
            </>
        );
    }

    if (field.type === 'select' && field.options?.length) {
        return (
            <>
                <input type="hidden" name={`specs[${field.key}]`} value={value} />
                <SearchableSelect
                    id={`specs_${field.key}`}
                    value={value}
                    onValueChange={setValue}
                    placeholder={`Select ${field.label.toLowerCase()}…`}
                    searchPlaceholder={`Search ${field.label.toLowerCase()}…`}
                    options={field.options.map((option) => ({
                        value: option,
                        label: option,
                    }))}
                />
            </>
        );
    }

    return (
        <Input
            id={`specs_${field.key}`}
            name={`specs[${field.key}]`}
            defaultValue={defaultValue ?? ''}
            placeholder={`Enter ${field.label.toLowerCase()}…`}
        />
    );
}

export default function ProductForm({
    product,
    prefillCategoryId,
    prefillBrandId,
    categories,
    brands,
    breadcrumbs,
}: Props) {
    const isEditing = product !== null;
    const cancelHref = isEditing
        ? `/admin/products/${product.id}`
        : '/admin/products';

    const initialCategoryId =
        product?.category_id ?? prefillCategoryId ?? categories[0]?.id ?? '';

    const [categoryId, setCategoryId] = useState(initialCategoryId);
    const [brandId, setBrandId] = useState(
        product?.brand_id ?? prefillBrandId ?? '',
    );
    const [status, setStatus] = useState<'published' | 'draft'>(
        product?.status ?? 'draft',
    );
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const handlePendingFilesChange = useCallback((files: File[]) => {
        setPendingFiles(files);
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);

        const formData = new FormData(event.currentTarget);
        formData.delete('images[]');
        pendingFiles.forEach((file) => formData.append('images[]', file));

        const url = isEditing
            ? `/admin/products/${product.id}`
            : '/admin/products';

        if (isEditing) {
            formData.append('_method', 'PUT');
        }

        router.post(url, formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === categoryId) ?? null,
        [categories, categoryId],
    );

    const categoryOptions = useMemo(
        () =>
            categories.map((category) => ({
                value: category.id,
                label: category.name,
            })),
        [categories],
    );

    const brandOptions = useMemo(
        () => [
            { value: 'none', label: 'No brand' },
            ...brands.map((brand) => ({
                value: brand.id,
                label: brand.name,
            })),
        ],
        [brands],
    );

    const specFields = selectedCategory?.product_template?.spec_fields ?? [];
    const requiresBrand =
        selectedCategory?.product_template?.rules?.requires_brand ?? false;

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={isEditing ? `Edit ${product.name}` : 'Create product'} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Catalog
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        {isEditing ? 'Edit product' : 'Create product'}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Add images, assign category and brand, then save before
                        adding variants.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="w-full"
                >
                    <Card className="border-sidebar-border/70 py-0 shadow-none">
                        <CardContent className="space-y-8 py-6">
                            <FormSection title="Media">
                                <ProductImagesField
                                    existingImages={product?.images ?? []}
                                    onPendingFilesChange={
                                        handlePendingFilesChange
                                    }
                                    error={errors.images}
                                />
                            </FormSection>

                                <Separator />

                                <FormSection title="Product details">
                                    <FormField
                                        label="Name"
                                        htmlFor="name"
                                        error={errors.name}
                                        className={formSpanTwo}
                                    >
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={product?.name ?? ''}
                                            placeholder="e.g. Arco Floor Lamp"
                                            required
                                        />
                                    </FormField>

                                    <FormField
                                        label="Category"
                                        htmlFor="category_id"
                                        error={errors.category_id}
                                        hint={
                                            selectedCategory?.product_template
                                                ? `Template: ${selectedCategory.product_template.name}`
                                                : undefined
                                        }
                                    >
                                        <input
                                            type="hidden"
                                            name="category_id"
                                            value={categoryId}
                                        />
                                        <SearchableSelect
                                            id="category_id"
                                            value={categoryId}
                                            onValueChange={setCategoryId}
                                            placeholder="Select a category…"
                                            searchPlaceholder="Search categories…"
                                            options={categoryOptions}
                                        />
                                    </FormField>

                                    <FormField
                                        label={`Brand${requiresBrand ? ' *' : ''}`}
                                        htmlFor="brand_id"
                                        error={errors.brand_id}
                                        hint={
                                            requiresBrand
                                                ? 'Required for this category template.'
                                                : 'Optional unless the template requires a brand.'
                                        }
                                    >
                                        <input
                                            type="hidden"
                                            name="brand_id"
                                            value={
                                                brandId === 'none' ? '' : brandId
                                            }
                                        />
                                        <SearchableSelect
                                            id="brand_id"
                                            value={brandId || 'none'}
                                            onValueChange={(value) =>
                                                setBrandId(
                                                    value === 'none' ? '' : value,
                                                )
                                            }
                                            placeholder="Select a brand…"
                                            searchPlaceholder="Search brands…"
                                            options={brandOptions}
                                        />
                                    </FormField>

                                    <FormField
                                        label="Visibility"
                                        htmlFor="status"
                                        error={errors.status}
                                        hint={
                                            status === 'published'
                                                ? 'Visible on the storefront when variants exist.'
                                                : 'Saved in admin only until you publish.'
                                        }
                                    >
                                        <input
                                            type="hidden"
                                            name="status"
                                            value={status}
                                        />
                                        <SearchableSelect
                                            id="status"
                                            value={status}
                                            onValueChange={(value) =>
                                                setStatus(
                                                    value as
                                                        | 'published'
                                                        | 'draft',
                                                )
                                            }
                                            placeholder="Select visibility…"
                                            options={[...PUBLISH_OPTIONS]}
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
                                                product?.description ?? ''
                                            }
                                            placeholder="Describe materials, designer notes, or key selling points…"
                                            rows={5}
                                        />
                                    </FormField>
                                </FormSection>

                                {specFields.length > 0 && (
                                    <>
                                        <Separator />
                                        <FormSection
                                            title="Specifications"
                                            description="Fields from the category product template."
                                        >
                                            {specFields.map((field) => (
                                                <FormField
                                                    key={field.key}
                                                    label={field.label}
                                                    htmlFor={`specs_${field.key}`}
                                                    error={
                                                        errors[
                                                            `specs.${field.key}`
                                                        ]
                                                    }
                                                    className={
                                                        field.type === 'textarea'
                                                            ? formSpanTwo
                                                            : undefined
                                                    }
                                                >
                                                    <SpecFieldInput
                                                        field={field}
                                                        defaultValue={
                                                            product?.specs?.[
                                                                field.key
                                                            ]
                                                        }
                                                    />
                                                </FormField>
                                            ))}
                                        </FormSection>
                                    </>
                                )}
                            </CardContent>

                        <CardFooter className="justify-end gap-3 border-t border-sidebar-border/70 py-6">
                            <Button variant="ghost" asChild>
                                <Link href={cancelHref}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEditing
                                    ? 'Save changes'
                                    : 'Create product'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
