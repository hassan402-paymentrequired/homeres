import { Head } from '@inertiajs/react';
import { FolderTree, Plus, Tag } from 'lucide-react';
import { useState } from 'react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import BrandCardItem from '@/components/admin/brand-card';
import BrandFormModal from '@/components/admin/brand-form-modal';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BrandCard, BrandNavGroupOption } from '@/types/brand';
import type { Paginated } from '@/types/pagination';

type Props = {
    brands: Paginated<BrandCard>;
    brandNavGroupOptions: BrandNavGroupOption[];
};

export default function BrandsIndex({
    brands,
    brandNavGroupOptions,
}: Props) {
    const items = brands.data;
    const [createOpen, setCreateOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);

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
                            Designer brands and storefront nav groups in one list.
                            Nav groups are the columns in the brands mega menu.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateGroupOpen(true)}
                        >
                            <FolderTree className="size-4" />
                            Add nav group
                        </Button>
                        <Button type="button" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Add brand
                        </Button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={Tag}
                        title="No brands yet"
                        description="Run the seeder or create your first brand to populate the storefront directory."
                        action={
                            <Button
                                type="button"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="size-4" />
                                Add brand
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

            <BrandFormModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                brand={null}
                navGroupOptions={brandNavGroupOptions}
            />

            <BrandFormModal
                open={createGroupOpen}
                onOpenChange={setCreateGroupOpen}
                brand={null}
                asNavGroup
            />
        </AdminLayout>
    );
}
