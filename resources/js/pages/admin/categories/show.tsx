import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { FolderTree, ImageIcon, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import CategoryCardItem from '@/components/admin/category-card';
import CategoryFormModal from '@/components/admin/category-form-modal';
import { Badge } from '@/components/ui/badge';
import type { ProductCard } from '@/types/product';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type {
    CategoryBreadcrumb,
    CategoryCard,
    CategoryStats,
    ProductTemplateOption,
} from '@/types/category';
import type { Paginated } from '@/types/pagination';

type Props = {
    category: CategoryCard;
    stats: CategoryStats;
    subcategories: Paginated<CategoryCard>;
    products: Paginated<ProductCard>;
    breadcrumbs: CategoryBreadcrumb[];
    productTemplates: ProductTemplateOption[];
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

export default function CategoryShow({
    category,
    stats,
    subcategories,
    products,
    breadcrumbs,
    productTemplates,
}: Props) {
    const subcategoryItems = subcategories.data;
    const productItems = products.data;
    const [editOpen, setEditOpen] = useState(false);
    const [subcategoryOpen, setSubcategoryOpen] = useState(false);

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={category.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-serif text-2xl font-medium tracking-wide">
                                {category.name}
                            </h1>
                            {!category.is_active && (
                                <Badge variant="outline">Inactive</Badge>
                            )}
                        </div>
                        {category.nav_group_label && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Navigation group: {category.nav_group_label}
                            </p>
                        )}
                        {category.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {category.description}
                            </p>
                        )}
                        {category.product_template && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Product template:{' '}
                                <span className="font-medium text-foreground">
                                    {category.product_template.name}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil className="size-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Delete "${category.name}"? This cannot be undone.`,
                                    )
                                ) {
                                    router.delete(
                                        `/admin/categories/${category.id}`,
                                    );
                                }
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setSubcategoryOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add subcategory
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Products"
                        value={stats.product_count}
                        icon={Package}
                    />
                    <StatCard
                        label="Subcategories"
                        value={stats.subcategories_count}
                        icon={FolderTree}
                    />
                    <StatCard
                        label="Active subcategories"
                        value={stats.active_subcategories_count}
                        icon={FolderTree}
                    />
                    <StatCard
                        label="In navigation"
                        value={stats.nav_visible_subcategories_count}
                        icon={FolderTree}
                    />
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Subcategories
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Direct children of this category.
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setSubcategoryOpen(true)}
                        >
                            <Plus className="size-4" />
                            Add subcategory
                        </Button>
                    </div>

                    {subcategoryItems.length === 0 ? (
                        <AdminEmptyState
                            className="py-12"
                            icon={FolderTree}
                            title="No subcategories yet"
                            description="Add one to build out this branch of the catalog."
                            action={
                                <Button
                                    type="button"
                                    onClick={() => setSubcategoryOpen(true)}
                                >
                                    <Plus className="size-4" />
                                    Add subcategory
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {subcategoryItems.map((subcategory) => (
                                    <CategoryCardItem
                                        key={subcategory.id}
                                        category={subcategory}
                                    />
                                ))}
                            </div>
                            <AdminPagination paginator={subcategories} />
                        </>
                    )}
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                                Products
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Products assigned to this category.
                            </p>
                        </div>
                        <Button size="sm" asChild>
                            <Link
                                href={`/admin/products/create?category=${category.id}`}
                            >
                                <Plus className="size-4" />
                                Add product
                            </Link>
                        </Button>
                    </div>

                    {productItems.length === 0 ? (
                        <AdminEmptyState
                            className="py-12"
                            icon={Package}
                            title="No products yet"
                            description="Create a product in this category to start building the catalog."
                            action={
                                <Button asChild>
                                    <Link
                                        href={`/admin/products/create?category=${category.id}`}
                                    >
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
                                        {productItems.map((product) => (
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
                                                                    alt={
                                                                        product.name
                                                                    }
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
                                                    {product.brand?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {product.status ===
                                                    'draft' ? (
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
            </div>

            <CategoryFormModal
                open={editOpen}
                onOpenChange={setEditOpen}
                category={category}
                parentCategory={null}
                productTemplates={productTemplates}
            />

            <CategoryFormModal
                open={subcategoryOpen}
                onOpenChange={setSubcategoryOpen}
                category={null}
                parentCategory={{ id: category.id, name: category.name }}
                productTemplates={productTemplates}
            />
        </AdminLayout>
    );
}
