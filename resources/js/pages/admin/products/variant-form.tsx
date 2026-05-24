import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import ProductImagesField from '@/components/admin/product-images-field';
import FormField, {
    FormSection,
    formSpanTwo,
} from '@/components/admin/form-field';
import SearchableSelect from '@/components/admin/searchable-select';
import VariantOptionFields, {
    buildVariantName,
} from '@/components/admin/variant-option-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import type {
    ProductBreadcrumb,
    ProductImage,
    ProductTemplateField,
    ProductVariantRecord,
    StockStatus,
    StockStatusOption,
} from '@/types/product';

type ProductSummary = {
    id: string;
    name: string;
    product_template: {
        name: string;
        variant_options: ProductTemplateField[];
        rules: { pricing_mode?: string };
    } | null;
};

type Props = {
    product: ProductSummary;
    variant: ProductVariantRecord | null;
    stockStatuses: StockStatusOption[];
    breadcrumbs: ProductBreadcrumb[];
};

const STOCK_HINTS: Record<StockStatus, string> = {
    in_store:
        'Available locally — delivery fees are calculated from the customer location at checkout.',
    in_stock_remote:
        'In stock overseas — customer chooses air or sea; import shipping is quoted separately.',
    out_of_stock:
        'Shown as sold out / enquire on the storefront.',
};

export default function ProductVariantForm({
    product,
    variant,
    stockStatuses,
    breadcrumbs,
}: Props) {
    const isEditing = variant !== null;
    const cancelHref = `/admin/products/${product.id}`;

    const variantOptions = product.product_template?.variant_options ?? [];
    const hasTemplateOptions = variantOptions.length > 0;

    const [optionValues, setOptionValues] = useState<Record<string, string>>(
        () => {
            const initial: Record<string, string> = {
                ...(variant?.option_values ?? {}),
            };

            for (const option of variantOptions) {
                if (initial[option.key] === undefined) {
                    initial[option.key] = '';
                }
            }

            return initial;
        },
    );

    const autoVariantName = useMemo(
        () => buildVariantName(variantOptions, optionValues),
        [variantOptions, optionValues],
    );

    const [stockStatus, setStockStatus] = useState<StockStatus>(
        variant?.stock_status ?? 'in_store',
    );
    const [priceOnRequest, setPriceOnRequest] = useState(
        variant?.price_on_request ??
            product.product_template?.rules?.pricing_mode === 'on_request',
    );
    const [isActive, setIsActive] = useState(variant?.is_active ?? true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    const handlePendingFilesChange = useCallback((files: File[]) => {
        setPendingFiles(files);
    }, []);

    const isRemote = stockStatus === 'in_stock_remote';

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData(event.currentTarget);
        formData.delete('images[]');
        pendingFiles.forEach((file) => formData.append('images[]', file));

        const url = isEditing
            ? `/admin/products/${product.id}/variants/${variant.id}`
            : `/admin/products/${product.id}/variants`;

        if (isEditing) {
            formData.append('_method', 'PUT');
        }

        router.post(url, formData, {
            forceFormData: true,
            onError: (formErrors) => {
                setErrors(formErrors as Record<string, string>);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleOptionChange = (key: string, value: string) => {
        setOptionValues((current) => ({ ...current, [key]: value }));
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
                        ? `Edit ${variant.name}`
                        : `Add variant · ${product.name}`
                }
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {product.name}
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        {isEditing ? 'Edit variant' : 'Add variant'}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Each variant has its own stock status, pricing, lead times,
                        and optional images. Product-level photos still apply when a
                        variant has no images of its own.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="w-full"
                >
                        <Card className="border-sidebar-border/70 py-0 shadow-none">
                            <CardHeader className="border-b border-sidebar-border/70 py-6">
                                <p className="text-sm font-medium">
                                    Variant configuration
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Inventory and fulfillment settings for this SKU.
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-8 py-6">
                                <FormSection
                                    title="Variant images"
                                    description="Optional. Shown on the storefront when this SKU is selected; otherwise shared product photos are used."
                                >
                                    <ProductImagesField
                                        existingImages={
                                            (variant?.images as ProductImage[] | undefined) ??
                                            []
                                        }
                                        onPendingFilesChange={
                                            handlePendingFilesChange
                                        }
                                        error={errors.images}
                                    />
                                </FormSection>

                                <Separator />

                                <FormSection title="Identity">
                                    {hasTemplateOptions ? (
                                        <>
                                            <FormField
                                                label="Variant name"
                                                htmlFor="variant_name_preview"
                                                hint="Built automatically from the template options below."
                                                className={formSpanTwo}
                                            >
                                                <input
                                                    type="hidden"
                                                    name="name"
                                                    value={
                                                        autoVariantName ||
                                                        'Default'
                                                    }
                                                />
                                                <Input
                                                    id="variant_name_preview"
                                                    value={
                                                        autoVariantName ||
                                                        'Default'
                                                    }
                                                    readOnly
                                                    className="bg-muted/30"
                                                />
                                            </FormField>

                                            <div className={formSpanTwo}>
                                                <p className="mb-4 text-sm font-medium">
                                                    Template options
                                                </p>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <VariantOptionFields
                                                        options={variantOptions}
                                                        values={optionValues}
                                                        onChange={
                                                            handleOptionChange
                                                        }
                                                        errors={errors}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <FormField
                                            label="Variant name"
                                            htmlFor="name"
                                            error={errors.name}
                                            hint="Use option values when applicable, e.g. Large / Ivory."
                                        >
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={
                                                    variant?.name ?? ''
                                                }
                                                placeholder="e.g. Large / Ivory"
                                                required
                                            />
                                        </FormField>
                                    )}

                                    <FormField
                                        label="SKU"
                                        htmlFor="sku"
                                        error={errors.sku}
                                        hint="Optional internal reference."
                                    >
                                        <Input
                                            id="sku"
                                            name="sku"
                                            defaultValue={variant?.sku ?? ''}
                                            placeholder="e.g. SOFA-LRG-IVR"
                                        />
                                    </FormField>
                                </FormSection>

                                <Separator />

                                <FormSection
                                    title="Stock & fulfillment"
                                    description="Controls how this variant appears and ships."
                                >
                                    <FormField
                                        label="Stock status"
                                        htmlFor="stock_status"
                                        error={errors.stock_status}
                                        hint={STOCK_HINTS[stockStatus]}
                                        className={formSpanTwo}
                                    >
                                        <input
                                            type="hidden"
                                            name="stock_status"
                                            value={stockStatus}
                                        />
                                        <SearchableSelect
                                            id="stock_status"
                                            value={stockStatus}
                                            onValueChange={(value) =>
                                                setStockStatus(
                                                    value as StockStatus,
                                                )
                                            }
                                            placeholder="Select stock status…"
                                            searchPlaceholder="Search status…"
                                            options={stockStatuses.map(
                                                (status) => ({
                                                    value: status.value,
                                                    label: status.label,
                                                }),
                                            )}
                                        />
                                    </FormField>

                                    {isRemote && (
                                        <>
                                            <FormField
                                                label="Air lead time (days)"
                                                htmlFor="lead_time_days_air"
                                                error={errors.lead_time_days_air}
                                                hint="Minimum days when customer chooses air freight."
                                            >
                                                <Input
                                                    id="lead_time_days_air"
                                                    name="lead_time_days_air"
                                                    type="number"
                                                    min={1}
                                                    defaultValue={
                                                        variant?.lead_time_days_air ??
                                                        ''
                                                    }
                                                    placeholder="e.g. 7"
                                                    required
                                                />
                                            </FormField>

                                            <FormField
                                                label="Sea lead time (days)"
                                                htmlFor="lead_time_days_sea"
                                                error={errors.lead_time_days_sea}
                                                hint="Minimum days when customer chooses sea freight."
                                            >
                                                <Input
                                                    id="lead_time_days_sea"
                                                    name="lead_time_days_sea"
                                                    type="number"
                                                    min={1}
                                                    defaultValue={
                                                        variant?.lead_time_days_sea ??
                                                        ''
                                                    }
                                                    placeholder="e.g. 45"
                                                    required
                                                />
                                            </FormField>
                                        </>
                                    )}

                                    <FormField
                                        label="Weight (kg)"
                                        htmlFor="weight_kg"
                                        error={errors.weight_kg}
                                        hint="Used for international shipping quotes."
                                    >
                                        <Input
                                            id="weight_kg"
                                            name="weight_kg"
                                            type="number"
                                            min={0}
                                            step="0.001"
                                            defaultValue={
                                                variant?.weight_kg ?? ''
                                            }
                                            placeholder="e.g. 12.5"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Quantity"
                                        htmlFor="quantity"
                                        error={errors.quantity}
                                        hint="Admin-only stock count. Not shown to customers."
                                    >
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            min={0}
                                            defaultValue={
                                                variant?.quantity ?? ''
                                            }
                                            placeholder="e.g. 3"
                                        />
                                    </FormField>
                                </FormSection>

                                <Separator />

                                <FormSection title="Pricing">
                                    <div
                                        className={`flex items-start gap-3 rounded-lg border border-sidebar-border/60 bg-muted/20 px-4 py-3 ${formSpanTwo}`}
                                    >
                                        <input
                                            type="hidden"
                                            name="price_on_request"
                                            value={priceOnRequest ? '1' : '0'}
                                        />
                                        <Checkbox
                                            id="price_on_request"
                                            checked={priceOnRequest}
                                            onCheckedChange={(checked) =>
                                                setPriceOnRequest(
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <div className="grid gap-1">
                                            <label
                                                htmlFor="price_on_request"
                                                className="text-sm font-medium leading-none"
                                            >
                                                Price on request
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Hide the numeric price and show an
                                                enquiry flow instead.
                                            </p>
                                        </div>
                                    </div>

                                    {!priceOnRequest && (
                                        <FormField
                                            label="Price (NGN)"
                                            htmlFor="price"
                                            error={errors.price}
                                            hint="Storefront price before delivery or import fees."
                                        >
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                defaultValue={
                                                    variant?.price ?? ''
                                                }
                                                placeholder="e.g. 2500000"
                                            />
                                        </FormField>
                                    )}
                                </FormSection>

                                <Separator />

                                <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/60 bg-muted/20 px-4 py-3">
                                    <input
                                        type="hidden"
                                        name="is_active"
                                        value={isActive ? '1' : '0'}
                                    />
                                    <Checkbox
                                        id="is_active"
                                        checked={isActive}
                                        onCheckedChange={(checked) =>
                                            setIsActive(checked === true)
                                        }
                                    />
                                    <div className="grid gap-1">
                                        <label
                                            htmlFor="is_active"
                                            className="text-sm font-medium leading-none"
                                        >
                                            Active variant
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            Inactive variants are hidden from the
                                            storefront.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="justify-end gap-3 border-t border-sidebar-border/70 py-6">
                                <Button variant="ghost" asChild>
                                    <Link href={cancelHref}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing
                                        ? 'Save variant'
                                        : 'Create variant'}
                                </Button>
                            </CardFooter>
                        </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
