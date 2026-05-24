import { Head, Link, router } from '@inertiajs/react';
import { FolderTree, Pencil, Trash2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Paginated } from '@/types/pagination';
import type {
    ProductTemplateBreadcrumb,
    ProductTemplateCategorySummary,
    ProductTemplateRecord,
    ProductTemplateStats,
} from '@/types/product-template';

type Props = {
    template: ProductTemplateRecord;
    stats: ProductTemplateStats;
    categories: Paginated<ProductTemplateCategorySummary>;
    breadcrumbs: ProductTemplateBreadcrumb[];
};

function RulesSummary({ template }: { template: ProductTemplateRecord }) {
    const { rules } = template;

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                Rules
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Default pricing</dt>
                    <dd className="font-medium">
                        {rules.pricing_mode === 'on_request'
                            ? 'Price on request'
                            : 'Fixed price'}
                    </dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Brand required</dt>
                    <dd className="font-medium">
                        {rules.requires_brand ? 'Yes' : 'No'}
                    </dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Minimum images</dt>
                    <dd className="font-medium">{rules.min_images ?? 0}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">PDP specs title</dt>
                    <dd className="text-right font-medium">
                        {rules.storefront_specs_title?.trim()
                            ? rules.storefront_specs_title
                            : `Template name (${template.name})`}
                    </dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">PDP specs layout</dt>
                    <dd className="font-medium">
                        {rules.specs_layout === 'two_column'
                            ? 'Two columns'
                            : 'Single column'}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

function FieldsPreviewTable({
    fields,
    emptyMessage,
}: {
    fields: ProductTemplateRecord['spec_fields'];
    emptyMessage: string;
}) {
    if (fields.length === 0) {
        return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
            <table className="w-full text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Label</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Required</th>
                        <th className="px-4 py-3 font-medium">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {[...fields]
                        .sort(
                            (a, b) =>
                                (a.position ?? 0) - (b.position ?? 0),
                        )
                        .map((field) => (
                            <tr
                                key={field.key}
                                className="border-b border-sidebar-border/50 last:border-0"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {field.label}
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {field.key}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {field.type}
                                </td>
                                <td className="px-4 py-3">
                                    {field.required ? 'Yes' : 'No'}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {field.options?.join(', ') ?? '—'}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function VariantOptionsPreview({
    fields,
}: {
    fields: ProductTemplateRecord['variant_options'];
}) {
    if (fields.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No variant options — products use a manual variant name.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
            <table className="w-full text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Label</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Required</th>
                    </tr>
                </thead>
                <tbody>
                    {[...fields]
                        .sort(
                            (a, b) =>
                                (a.position ?? 0) - (b.position ?? 0),
                        )
                        .map((field) => (
                            <tr
                                key={field.key}
                                className="border-b border-sidebar-border/50 last:border-0"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {field.label}
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {field.key}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {field.type}
                                </td>
                                <td className="px-4 py-3">
                                    {field.required ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ProductTemplateShow({
    template,
    stats,
    categories,
    breadcrumbs,
}: Props) {
    const categoryItems = categories.data;

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={template.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-serif text-2xl font-medium tracking-wide">
                                {template.name}
                            </h1>
                            {template.is_system && (
                                <Badge variant="outline">Built-in</Badge>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Slug: {template.slug}
                        </p>
                        {template.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {template.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={`/admin/product-templates/${template.id}/edit`}
                            >
                                <Pencil className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Delete "${template.name}"? This cannot be undone.`,
                                    )
                                ) {
                                    router.delete(
                                        `/admin/product-templates/${template.id}`,
                                    );
                                }
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 lg:col-span-1">
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Categories
                        </p>
                        <p className="mt-2 font-serif text-3xl font-medium">
                            {stats.categories_count}
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <RulesSummary template={template} />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Spec fields
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Structured fields on the product form and storefront.
                    </p>
                    <div className="mt-4">
                        <FieldsPreviewTable
                            fields={template.spec_fields}
                            emptyMessage="No spec fields — products only use name, description, and images."
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Variant options
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Shown when adding variants to products in linked
                        categories.
                    </p>
                    <div className="mt-4">
                        <VariantOptionsPreview
                            fields={template.variant_options}
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                        Linked categories
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Categories that use this template for product forms.
                    </p>

                    {categoryItems.length === 0 ? (
                        <AdminEmptyState
                            className="mt-4 py-12"
                            icon={FolderTree}
                            title="No categories linked"
                            description="Edit a category and assign this template to start using it."
                            action={
                                <Button variant="outline" asChild>
                                    <Link href="/admin/categories">
                                        Browse categories
                                    </Link>
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            <div className="mt-4 overflow-hidden rounded-xl border border-sidebar-border/70">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                Category
                                            </th>
                                            <th className="px-4 py-3 font-medium" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryItems.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-sidebar-border/50 last:border-0"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/categories/${category.id}`}
                                                        >
                                                            View
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <AdminPagination paginator={categories} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
