import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BrandBreadcrumb, BrandCard, BrandStats } from '@/types/brand';

type Props = {
    brand: BrandCard;
    stats: BrandStats;
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

export default function BrandShow({ brand, stats, breadcrumbs }: Props) {
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
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Products"
                        value={stats.product_count}
                        icon={Package}
                    />
                </div>

                <AdminEmptyState
                    className="py-12"
                    icon={Package}
                    title="No products yet"
                    description="Product management for this brand will be available in the Products module."
                />
            </div>
        </AdminLayout>
    );
}
