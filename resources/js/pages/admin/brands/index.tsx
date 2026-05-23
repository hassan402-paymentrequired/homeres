import { Head, Link } from '@inertiajs/react';
import { Plus, Tag } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import BrandCardItem from '@/components/admin/brand-card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BrandCard } from '@/types/brand';
import type { Paginated } from '@/types/pagination';

type Props = {
    brands: Paginated<BrandCard>;
};

export default function BrandsIndex({ brands }: Props) {
    const items = brands.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Brands', href: '/admin/brands' },
            ]}
        >
            <Head title="Brands" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Catalog
                        </p>
                        <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                            Brands
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            Manage designer brands shown in the storefront directory
                            and linked to products.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/brands/create">
                            <Plus className="size-4" />
                            Add brand
                        </Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={Tag}
                        title="No brands yet"
                        description="Run the seeder or create your first brand to populate the storefront directory."
                        action={
                            <Button asChild>
                                <Link href="/admin/brands/create">
                                    <Plus className="size-4" />
                                    Add brand
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((brand) => (
                                <BrandCardItem key={brand.id} brand={brand} />
                            ))}
                        </div>
                        <AdminPagination paginator={brands} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
