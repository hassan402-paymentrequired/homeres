import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Layers,
    Package,
    Pencil,
    Plus,
    Trash2,
    Truck,
    Warehouse,
} from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import { resolveAdminProductImageSrc } from '@/lib/admin-product-image';
import AdminPagination from '@/components/admin/admin-pagination';
import ProductSpecsPreview from '@/components/admin/product-specs-preview';
import StockStatusBadge from '@/components/admin/stock-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Paginated } from '@/types/pagination';
import type {
    ProductBreadcrumb,
    ProductRecord,
    ProductStats,
    ProductVariantCard,
} from '@/types/product';

type Props = {
    product: ProductRecord;
    stats: ProductStats;
    variants: Paginated<ProductVariantCard>;
    breadcrumbs: ProductBreadcrumb[];
};

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: LucideIcon;
}) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
            </div>
            <p className="mt-2 font-serif text-2xl font-medium">{value}</p>
        </div>
    );
}

function formatPrice(variant: ProductVariantCard): string {
    if (variant.price_on_request) {
        return 'Price on request';
    }

    if (variant.price === null) {
        return '—';
    }

    return `₦${Number(variant.price).toLocaleString('en-NG')}`;
}

export default function ProductShow({
    product,
    stats,
    variants,
    breadcrumbs,
}: Props) {
    const variantItems = variants.data;

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={product.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-serif text-2xl font-medium tracking-wide">
                                {product.name}
                            </h1>
                            {!product.is_active && (
                                <Badge variant="outline">Draft</Badge>
                            )}
                        </div>

                        {product.images.length > 0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {product.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-muted/20"
                                    >
                                        <img
                                            src={resolveAdminProductImageSrc(image)}
                                            alt={image.alt || product.name}
                                            className="aspect-[4/3] w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className='flex items-center mt-2 gap-3'>

                        {product.category && (
                            <Badge> {product.category.name}</Badge>
                        )}
                        
                        {product.brand && (
                             <Badge variant={"secondary"}> {product.brand.name}</Badge>
                        )}
                        </div>

                        {product.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Delete "${product.name}" and all variants? This cannot be undone.`,
                                    )
                                ) {
                                    router.delete(`/admin/products/${product.id}`);
                                }
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                        <Button asChild>
                            <Link
                                href={`/admin/products/${product.id}/variants/create`}
                            >
                                <Plus className="size-4" />
                                Add variant
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Variants"
                        value={stats.variants_count}
                        icon={Layers}
                    />
                    <StatCard
                        label="In store"
                        value={stats.in_store_count}
                        icon={Warehouse}
                    />
                    <StatCard
                        label="Remote stock"
                        value={stats.remote_stock_count}
                        icon={Truck}
                    />
                    <StatCard
                        label="Sold out"
                        value={stats.out_of_stock_count}
                        icon={Package}
                    />
                </div>

                {product.product_template && (
                    <ProductSpecsPreview
                        specFields={product.product_template.spec_fields}
                        specs={product.specs}
                    />
                )}

                <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Variants
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Each variant has its own stock status, pricing, and
                                lead times.
                            </p>
                        </div>
                        <Button size="sm" asChild>
                            <Link
                                href={`/admin/products/${product.id}/variants/create`}
                            >
                                <Plus className="size-4" />
                                Add variant
                            </Link>
                        </Button>
                    </div>

                    {variantItems.length === 0 ? (
                        <AdminEmptyState
                            className="py-12"
                            icon={Layers}
                            title="No variants yet"
                            description="Add at least one variant with stock status and pricing before this product can appear on the storefront."
                            action={
                                <Button asChild>
                                    <Link
                                        href={`/admin/products/${product.id}/variants/create`}
                                    >
                                        <Plus className="size-4" />
                                        Add variant
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
                                                Variant
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Stock
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Lead times
                                            </th>
                                            <th className="px-4 py-3 font-medium" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantItems.map((variant) => (
                                            <tr
                                                key={variant.id}
                                                className="border-b border-sidebar-border/50 last:border-0"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">
                                                        {variant.name}
                                                    </p>
                                                    {variant.sku && (
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            SKU: {variant.sku}
                                                        </p>
                                                    )}
                                                    {!variant.is_active && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1"
                                                        >
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StockStatusBadge
                                                        status={
                                                            variant.stock_status
                                                        }
                                                        label={
                                                            variant.stock_status_label
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatPrice(variant)}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {variant.stock_status ===
                                                    'in_stock_remote' ? (
                                                        <>
                                                            Air:{' '}
                                                            {
                                                                variant.lead_time_days_air
                                                            }{' '}
                                                            days
                                                            <br />
                                                            Sea:{' '}
                                                            {
                                                                variant.lead_time_days_sea
                                                            }{' '}
                                                            days
                                                        </>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/products/${product.id}/variants/${variant.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Delete variant "${variant.name}"?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/admin/products/${product.id}/variants/${variant.id}`,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <AdminPagination paginator={variants} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
