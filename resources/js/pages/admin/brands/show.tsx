import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import ProductCardItem from '@/components/admin/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BrandBreadcrumb, BrandCard, BrandStats } from '@/types/brand';
import type { Paginated } from '@/types/pagination';
import type { ProductCard } from '@/types/product';

type Props = {
    brand: BrandCard;
    stats: BrandStats;
    products: Paginated<ProductCard>;
    breadcrumbs: BrandBreadcrumb[];
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

export default function BrandShow({
    brand,
    stats,
    products,
    breadcrumbs,
}: Props) {
    const productItems = products.data;

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={brand.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-serif text-2xl font-medium tracking-wide">
                                {brand.name}
                            </h1>
                            {!brand.is_active && (
                                <Badge variant="outline">Inactive</Badge>
                            )}
                            {!brand.show_in_nav && (
                                <Badge variant="outline">Hidden from nav</Badge>
                            )}
                        </div>
                        {brand.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {brand.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/brands/${brand.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Delete "${brand.name}"? This cannot be undone.`,
                                    )
                                ) {
                                    router.delete(`/admin/brands/${brand.id}`);
                                }
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/products/create?brand=${brand.id}`}>
                                <Plus className="size-4" />
                                Add product
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Products"
                        value={stats.product_count}
                        icon={Package}
                    />
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Products
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Products linked to this brand.
                            </p>
                        </div>
                        <Button size="sm" asChild>
                            <Link href={`/admin/products/create?brand=${brand.id}`}>
                                <Plus className="size-4" />
                                Add product
                            </Link>
                        </Button>
                    </div>

                    {productItems.length === 0 ? (
                        <AdminEmptyState
                            className="py-12"
                            icon={Package}
                            title="No products for this brand"
                            description="Create a product and link it to this brand to start building the catalog."
                            action={
                                <Button asChild>
                                    <Link
                                        href={`/admin/products/create?brand=${brand.id}`}
                                    >
                                        <Plus className="size-4" />
                                        Add product
                                    </Link>
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {productItems.map((product) => (
                                    <ProductCardItem
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                            <AdminPagination paginator={products} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
