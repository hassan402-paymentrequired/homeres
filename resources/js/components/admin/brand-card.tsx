import { Link } from '@inertiajs/react';
import { ArrowRight, FolderTree, Package, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BrandCard } from '@/types/brand';

type Props = {
    brand: BrandCard;
};

export default function BrandCardItem({ brand }: Props) {
    const Icon = brand.is_parent ? FolderTree : Tags;

    return (
        <Link
            href={`/admin/brands/${brand.id}`}
            prefetch
            className="group flex flex-col rounded-xl border border-sidebar-border/70 bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-muted/40">
                    <Icon className="size-5" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>

            <div className="mt-4 flex flex-1 flex-col">
                <h2 className="text-sm font-medium tracking-wide">{brand.name}</h2>

                {brand.parent && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Nav group: {brand.parent.name}
                    </p>
                )}

                {brand.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {brand.description}
                    </p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {brand.is_parent && (
                        <Badge variant="secondary">Nav group</Badge>
                    )}
                    {!brand.is_active && (
                        <Badge variant="outline">Inactive</Badge>
                    )}
                    {!brand.show_in_nav && (
                        <Badge variant="outline">Hidden from nav</Badge>
                    )}
                </div>

                <div className="mt-auto pt-4 text-xs text-muted-foreground">
                    {brand.is_parent ? (
                        <span className="inline-flex items-center gap-1">
                            <Tags className="size-3.5" />
                            {brand.children_count} brands in menu
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1">
                            <Package className="size-3.5" />
                            {brand.product_count} products
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
