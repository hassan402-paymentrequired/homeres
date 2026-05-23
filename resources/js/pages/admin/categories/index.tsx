import { Head, Link } from '@inertiajs/react';
import { FolderTree, Plus } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import CategoryCardItem from '@/components/admin/category-card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { CategoryCard } from '@/types/category';
import type { Paginated } from '@/types/pagination';

type Props = {
    categories: Paginated<CategoryCard>;
};

export default function CategoriesIndex({ categories }: Props) {
    const items = categories.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Categories', href: '/admin/categories' },
            ]}
        >
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Catalog
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Categories
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Top-level categories for your storefront. Open a category
                            to manage subcategories and view catalog stats.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/categories/create">
                            <Plus className="size-4" />
                            Add category
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={FolderTree}
                        title="No categories yet"
                        description="Run the seeder or create your first category to start building the catalog."
                        action={
                            <Button asChild>
                                <Link href="/admin/categories/create">
                                    <Plus className="size-4" />
                                    Add category
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((category) => (
                                <CategoryCardItem
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                        <AdminPagination paginator={categories} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
