import { Head, Link } from '@inertiajs/react';
import { LayoutTemplate, Plus } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Paginated } from '@/types/pagination';
import type { ProductTemplateRow } from '@/types/product-template';

type Props = {
    templates: Paginated<ProductTemplateRow>;
};

export default function ProductTemplatesIndex({ templates }: Props) {
    const items = templates.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Product templates', href: '/admin/product-templates' },
            ]}
        >
            <Head title="Product templates" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Catalog
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Product templates
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Define spec fields and variant options for product
                            types — assign templates to categories so new
                            products get the right forms automatically.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/product-templates/create">
                            <Plus className="size-4" />
                            Add template
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={LayoutTemplate}
                        title="No product templates yet"
                        description="Create a template for each product type you sell — e.g. shoes, vases, or books."
                        action={
                            <Button asChild>
                                <Link href="/admin/product-templates/create">
                                    <Plus className="size-4" />
                                    Add template
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <table className="w-full text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Template
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Spec fields
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Variant options
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Categories
                                        </th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((template) => (
                                        <tr
                                            key={template.id}
                                            className="border-b border-sidebar-border/50 last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/product-templates/${template.id}`}
                                                    className="font-medium transition hover:opacity-80"
                                                >
                                                    {template.name}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {template.slug}
                                                </p>
                                                {template.is_system && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mt-1"
                                                    >
                                                        Built-in
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {template.spec_fields_count}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {
                                                    template.variant_options_count
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {template.categories_count}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/product-templates/${template.id}`}
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
                        <AdminPagination paginator={templates} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
