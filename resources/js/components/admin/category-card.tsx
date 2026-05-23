import { Link } from '@inertiajs/react';
import { ArrowRight, FolderTree, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CategoryCard } from '@/types/category';

type Props = {
    category: CategoryCard;
};

export default function CategoryCardItem({ category }: Props) {
    return (
        <Link
            href={`/admin/categories/${category.id}`}
            prefetch
            className="group flex flex-col rounded-xl border border-sidebar-border/70 bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-muted/40">
                    <FolderTree className="size-5" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>

            <div className="mt-4 flex flex-1 flex-col">
                <h2 className="text-sm font-medium tracking-wide">{category.name}</h2>

                {category.nav_group_label && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {category.nav_group_label}
                    </p>
                )}

                {category.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                    </p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {!category.is_active && (
                        <Badge variant="outline">Inactive</Badge>
                    )}
                    {category.product_template && (
                        <Badge variant="outline">{category.product_template.name}</Badge>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <FolderTree className="size-3.5" />
                        {category.children_count} subcategories
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Package className="size-3.5" />
                        {category.product_count} products
                    </span>
                </div>
            </div>
        </Link>
    );
}
