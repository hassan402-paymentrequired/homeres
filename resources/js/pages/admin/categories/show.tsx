import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { FolderTree, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import CategoryCardItem from '@/components/admin/category-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type {
    CategoryBreadcrumb,
    CategoryCard,
    CategoryStats,
} from '@/types/category';
import type { Paginated } from '@/types/pagination';

type Props = {
    category: CategoryCard;
    stats: CategoryStats;
    subcategories: Paginated<CategoryCard>;
    breadcrumbs: CategoryBreadcrumb[];
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
    breadcrumbs,
}: Props) {
    const subcategoryItems = subcategories.data;

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
                        <Button variant="outline" asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit
                            </Link>
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
                        <Button asChild>
                            <Link
                                href={`/admin/categories/create?parent=${category.id}`}
                            >
                                <Plus className="size-4" />
                                Add subcategory
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
                        <Button size="sm" asChild>
                            <Link
                                href={`/admin/categories/create?parent=${category.id}`}
                            >
                                <Plus className="size-4" />
                                Add subcategory
                            </Link>
                        </Button>
                    </div>

                    {subcategoryItems.length === 0 ? (
                        <AdminEmptyState
                            className="py-12"
                            icon={FolderTree}
                            title="No subcategories yet"
                            description="Add one to build out this branch of the catalog."
                            action={
                                <Button asChild>
                                    <Link
                                        href={`/admin/categories/create?parent=${category.id}`}
                                    >
                                        <Plus className="size-4" />
                                        Add subcategory
                                    </Link>
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
            </div>
        </AdminLayout>
    );
}
