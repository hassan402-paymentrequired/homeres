import { Head, Link } from '@inertiajs/react';
import { ImageIcon, Package, Plus } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Paginated } from '@/types/pagination';
import type { ProductCard } from '@/types/product';

type Props = {
    products: Paginated<ProductCard>;
};

export default function ProductsIndex({ products }: Props) {
    const items = products.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Products', href: '/admin/products' },
            ]}
        >
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Catalog
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Products
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Scan the full catalog — category, brand, status, and
                            variant counts at a glance.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/products/create">
                            <Plus className="size-4" />
                            Add product
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={Package}
                        title="No products yet"
                        description="Create your first product, then add variants with stock status, lead times, and pricing."
                        action={
                            <Button asChild>
                                <Link href="/admin/products/create">
                                    <Plus className="size-4" />
                                    Add product
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
                                            Product
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Brand
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Variants
                                        </th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b border-sidebar-border/50 last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="flex items-center gap-3 transition hover:opacity-80"
                                                >
                                                    <div className="size-10 shrink-0 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted/30">
                                                        {product.thumbnail_url ? (
                                                            <img
                                                                src={
                                                                    product.thumbnail_url
                                                                }
                                                                alt={product.name}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                                <ImageIcon className="size-4 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {product.name}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {product.category?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {product.brand?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.status === 'draft' ? (
                                                    <Badge variant="outline">
                                                        Draft
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Published
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {product.variants_count}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
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
                        <AdminPagination paginator={products} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
